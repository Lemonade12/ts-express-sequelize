const postRepo = require("../repository/postRepository");
import multer from "multer";
import fs from "fs";
import ApiError from "../modules/api.error";
import {
  CreateInfoDTO,
  ListCondition,
  UpdateInfoDTO,
  hitRankListDTO,
  hitListDTO,
  commentInfoDTO,
  alarmInfoDTO,
  commentUpdateInfoDTO,
} from "../interfaces/post";
import { Request, Response } from "express";
import path from "path";

const redisClient = require("../../database/redis");
//redisClient.connect().then();

const esClient = require("../../database/elastic");

async function createPostService(postInfo: CreateInfoDTO, userId: number) {
  const { title, content, hashtags } = postInfo;
  const newPost = await postRepo.createPost(title, content, userId);

  if (hashtags) {
    //hashtag 존재 시
    //hashtag 배열 형태로 처리
    let tags: string[] = hashtags.replace(/\#/g, "").split(",");

    for (let i = 0; i < tags.length; i++) {
      const isExistedTag = await postRepo.readTagByName(tags[i]);
      let tag;
      // tag 존재시 post_tag 테이블에 추가
      if (isExistedTag) {
        postRepo.createPostTag(newPost.id, isExistedTag.id);
      } else {
        // tag 존재하지 않을 시  tag 테이블에 추가 후 post_tag 테이블에 추가
        tag = await postRepo.createTag(tags[i]);
        postRepo.createPostTag(newPost.id, tag.id);
      }
    }
  }
  //redis에 조회 수 업데이트
  console.log("redis에 있으면");
  await redisClient.zAdd("topHitList", {
    score: 0,
    value: String(newPost.id),
  });
  return newPost.id;
}

async function updatePostService(updateInfo: UpdateInfoDTO, userId: number, postId: number) {
  const postInfo = await postRepo.readPostById(postId);
  // 게시글 존재 유무 체크
  if (!postInfo) {
    const error = new ApiError(404, "존재하지 않는 게시글 입니다.");
    throw error;
  }
  // 해당 게시글 작성자인지 체크
  if (postInfo.user_id !== userId) {
    const error = new ApiError(401, "해당 게시글에 대한 권한이 없습니다.");
    throw error;
  }
  await postRepo.updatePost(updateInfo, postId);

  if (updateInfo.is_deleted == true) {
    //이미 삭제된 게시글일 경우
    if (postInfo.is_deleted == true) {
      const error = new ApiError(400, "이미 삭제된 게시글 입니다.");
      throw error;
    }
    //해당 게시글 redis에서 삭제(24시간 이내의 게시글일 경우)
    if (postInfo.createdAt - Number(new Date()) <= 24 * 60 * 60 * 1000) {
      await redisClient.zRem("topHitList", String(postId));
    }
    return { message: "게시글 삭제 완료" };
  } else if (updateInfo.is_deleted == false) {
    //이미 복구된? 존재하는 게시글일 경우
    if (postInfo.is_deleted == false) {
      const error = new ApiError(400, "이미 복구된(존재하는) 게시글 입니다.");
      throw error;
    }
    //해당 게시글 redis에 업데이트(24시간 이내의 게시글일 경우 / 조회 수 유지할지?)
    if (postInfo.createdAt - Number(new Date()) <= 24 * 60 * 60 * 1000) {
      await redisClient.zAdd("topHitList", {
        score: postInfo.hit,
        value: String(postId),
      });
    }
    return { message: "게시글 복구 완료" };
  } else {
    return { message: "게시글 수정 완료" };
  }
}

async function readPostService(postId: number) {
  const postInfo = await postRepo.readPostById(postId);
  if (!postInfo || postInfo.is_deleted == 1) {
    // 게시글이 존재하지 않거나 삭제된 게시글인 경우
    const error = new ApiError(404, "존재하지 않는 게시글 입니다.");
    throw error;
  }
  //조회수 업데이트(나중에 redis에서 일정시간마다 업데이트)
  const updateInfo: UpdateInfoDTO = {
    hit: postInfo.hit + 1,
  };
  postInfo.hit++;
  postRepo.updatePost(updateInfo, postId);

  //24시간 이내의 게시글이면 redis에 업뎃
  if (postInfo.createdAt - Number(new Date()) <= 24 * 60 * 60 * 1000) {
    console.log("redis에 있음");
    const hit: number = await redisClient.zScore("topHitList", String(postId));
    await redisClient.zAdd("topHitList", {
      score: hit + 1,
      value: String(postId),
    }); //업데이트하는부분 체크 1증가 부분
  }
  const commentList = await postRepo.readCommentList(postId);

  return { postInfo, commentList };
}

async function likePost(postId: number, userId: number) {
  const postInfo = await postRepo.readPostById(postId);
  if (!postInfo || postInfo.is_deleted == 1) {
    // 게시글이 존재하지 않거나 삭제된 게시글인 경우
    const error = new ApiError(404, "존재하지 않는 게시글 입니다.");
    throw error;
  }
  const isLiked = await postRepo.readLikeByPostIdAndUserId(postId, userId);
  if (!isLiked) {
    //좋아요 아닌 경우에는 좋아요
    await postRepo.createLike(postId, userId);
    return { isLiked: true };
  } else {
    // 좋아요 취소
    await postRepo.deleteLike(postId, userId);
    return { isLiked: false };
  }
}

async function readPostListService(condition: ListCondition) {
  // default 값 세팅
  if (!condition.orderBy) {
    condition.orderBy = "작성일";
  }
  if (!condition.order) {
    condition.order = "DESC";
  }
  if (!condition.page) {
    condition.page = 1;
  }
  if (!condition.limit) {
    condition.limit = 10;
  }
  console.log(condition);
  const data = await postRepo.readPostList(condition);
  await esClient.index({
    index: "search-logs",
    body: {
      searchWord: condition.search,
      timestamp: new Date(),
    },
  });
  return data;
}

async function readHitRankService() {
  const isExistedList: number = await redisClient.zCard("topHitList");
  const top10RankList: hitRankListDTO[] = [];
  // redis에 있으면 redis에서 가져오고

  console.log("redis에 있으면");
  // redis 에서 top 10 조회수 게시글만 가져옴
  const hitList: hitListDTO[] = await redisClient.zRangeWithScores(
    "topHitList",
    -10,
    isExistedList - 1
  );
  for (let i = 0; i < hitList.length; i++) {
    top10RankList.push({
      ranking: i + 1,
      postId: Number(hitList[hitList.length - i - 1].value),
      hit: hitList[hitList.length - i - 1].score,
    });
  }
  return top10RankList;
}

async function createCommentService(commentInfo: commentInfoDTO) {
  const { postId, userId, content } = commentInfo;
  const newComment = await postRepo.createComment(postId, userId, content);
  //console.log(newComment.user_id);
  return newComment;
}

async function createCommentAlarmService(alarmInfo: alarmInfoDTO) {
  const { userId, commentId } = alarmInfo;
  const newAlarm = await postRepo.createCommentAlarm(userId, commentId);
  return newAlarm;
}

async function readAlarmListService(userId: number) {
  const alarmList = await postRepo.readAlarmList(userId);
  return alarmList;
}

async function readAlarmService(alarmId: number) {
  const alarmInfo = await postRepo.readAlarm(alarmId);
  return alarmInfo;
}

async function updateCommentService(
  updateInfo: commentUpdateInfoDTO,
  userId: number,
  commentId: number
) {
  const commentInfo = await postRepo.readComment(commentId);
  // 댓글 존재 유무 체크
  if (!commentInfo) {
    const error = new ApiError(404, "존재하지 않는 댓글 입니다.");
    throw error;
  }
  // 해당 게시글 작성자인지 체크
  if (commentInfo.user_id !== userId) {
    const error = new ApiError(401, "해당 댓글에 대한 권한이 없습니다.");
    throw error;
  }
  if (updateInfo.is_deleted == true) {
    // 댓글 삭제
    if (commentInfo.is_deleted == true) {
      const error = new ApiError(400, "이미 삭제된 댓글 입니다.");
      throw error;
    }
    await postRepo.updateComment(updateInfo, commentId);
    return { message: "댓글 삭제 완료" };
  } else {
    // 댓글 수정
    await postRepo.updateComment(updateInfo, commentId);
    return { message: "댓글 수정 완료" };
  }
}

module.exports = {
  createPostService,
  updatePostService,
  readPostService,
  likePost,
  readPostListService,
  readHitRankService,
  createCommentService,
  updateCommentService,
  createCommentAlarmService,
  readAlarmListService,
  readAlarmService,
};
