import {
  CreateInfoDTO,
  UpdateInfoDTO,
  ListCondition,
  fileInfoDTO,
  commentUpdateInfoDTO,
} from "../interfaces/post";

const db = require("../../database/index");
const post = db.post;
const tag = db.tag;
const post_tag = db.post_tag;
const like = db.like;
const user = db.user;
const file = db.file;
const comment = db.comment;
const alarm = db.alarm;
const sequelize = require("sequelize");
const Op = sequelize.Op;

async function createPost(title: string, content: string, userId: number) {
  return post.create({
    title: title,
    content: content,
    user_id: userId,
  });
}

async function createTag(name: string) {
  return tag.create({
    name: name,
  });
}

async function createPostTag(postId: number, tagId: number) {
  return post_tag.create({
    post_id: postId,
    tag_id: tagId,
  });
}

async function readTagByName(name: string) {
  const data = await tag.findOne({
    where: { name: name },
    raw: true,
  });
  return data;
}

async function readPostById(postId: number) {
  const data = await post.findOne({
    where: { id: postId },
    raw: true,
  });
  return data;
}

async function updatePost(updateInfo: UpdateInfoDTO, postId: number) {
  return post.update(updateInfo, {
    where: {
      id: postId,
    },
  });
}

async function readLikeByPostIdAndUserId(postId: number, userId: number) {
  const data = await like.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
    raw: true,
  });
  return data;
}

async function createLike(postId: number, userId: number) {
  return like.create({
    post_id: postId,
    user_id: userId,
  });
}

async function deleteLike(postId: number, userId: number) {
  return like.destroy({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });
}

async function readPostList(condition: ListCondition) {
  if (condition.page && condition.limit) {
    const offset: number = (condition.page - 1) * condition.limit;

    const data = await post.findAll({
      attributes: [
        ["id", "게시글_id"],
        ["title", "제목"],
        ["hit", "조회수"],
        ["createdAt", "작성일"],
        [sequelize.col("user.name"), "작성자"],
        [sequelize.fn("count", sequelize.col("like.id")), "좋아요 수"],
      ],
      include: [
        {
          model: user,
          as: "user",
          attributes: [],
        },
        {
          model: like,
          as: "like",
          attributes: [],
        },
      ],
      group: "post.id",
      where: {
        title: {
          [Op.like]: "%" + condition.search + "%",
        },
      },
      order: [[condition.orderBy, condition.order]],
      offset: offset,
      limit: condition.limit,
      subQuery: false,
      raw: true,
    });
    return data;
  }
}

// 24시간 이내 게시글만, is_deleted 체크해야함
async function readHitRank() {
  const data = await post.findAll({
    attributes: ["id", "hit"],
    where: {
      createdAt: {
        [Op.gte]: Number(new Date()) - 24 * 60 * 60 * 1000, // 하루
      },
    },
    order: [["hit", "DESC"]],
    raw: true,
  });
  return data;
}

async function uploadFile(fileInfo: fileInfoDTO) {
  return file.create(fileInfo);
}

async function createComment(postId: number, userId: number, content: string) {
  return comment.create({
    post_id: postId,
    user_id: userId,
    content: content,
  });
}

async function readComment(commentId: number) {
  const data = comment.findOne({
    where: {
      id: commentId,
    },
  });
  return data;
}

async function readCommentList(postId: number) {
  const data = comment.findAll({
    attributes: [
      ["id", "댓글_id"],
      ["content", "댓글내용"],
      [sequelize.col("user.name"), "댓글작성자"],
    ],
    include: [
      {
        model: user,
        as: "user",
        attributes: [],
      },
    ],
    where: {
      post_id: postId,
      is_deleted: false,
    },
  });
  return data;
}

async function updateComment(updateInfo: commentUpdateInfoDTO, commentId: number) {
  return comment.update(updateInfo, {
    where: {
      id: commentId,
    },
  });
}

async function createCommentAlarm(userId: number, commentId: number) {
  return alarm.create({
    user_id: userId,
    comment_id: commentId,
  });
}

async function readAlarmList(userId: number) {
  const data = await alarm.findAll({
    attributes: [
      ["id", "알람_id"],
      [sequelize.col("comment.id"), "댓글_id"],
      [sequelize.col("comment.post.id"), "게시글_id"],
      [sequelize.col("comment.post.title"), "게시글제목"],
      [sequelize.col("comment.content"), "댓글내용"],
    ],
    include: [
      {
        model: comment,
        as: "comment",
        attributes: [],
        include: [
          {
            model: post,
            as: "post",
            attributes: [],
          },
        ],
      },
    ],
    where: {
      user_id: userId,
      is_checked: false,
    },
    subQuery: false,
    raw: true,
  });
  return data;
}

async function readAlarm(alarmId: number) {
  const data = await alarm.findOne({
    attributes: [
      ["id", "알람_id"],
      [sequelize.col("comment.id"), "댓글_id"],
      [sequelize.col("comment.post.id"), "게시글_id"],
    ],
    include: [
      {
        model: comment,
        as: "comment",
        attributes: [],
        include: [
          {
            model: post,
            as: "post",
            attributes: [],
          },
        ],
      },
    ],
    where: {
      id: alarmId,
    },
    subQuery: false,
    raw: true,
  });

  await alarm.update(
    { is_checked: true },
    {
      where: {
        id: alarmId,
      },
    }
  );
  return data;
}

/*async function readHitTop10Rank() {
  const data = await post.findAll({
    attributes: ["id", "hit"],
    order: [["hit", "DESC"]],
    limit: 10,
    raw: true,
  });
  return data;
}*/

module.exports = {
  createPost,
  createTag,
  createPostTag,
  readTagByName,
  readPostById,
  updatePost,
  readLikeByPostIdAndUserId,
  createLike,
  deleteLike,
  readPostList,
  readHitRank,
  uploadFile,
  createComment,
  updateComment,
  readComment,
  readCommentList,
  createCommentAlarm,
  readAlarmList,
  readAlarm,
};
