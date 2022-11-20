import ApiError from "../modules/api.error";
import { CreateInfoDTO, UpdateInfoDTO } from "../interfaces/post";
const postRepo = require("../repository/postRepository");

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
    const error = new ApiError(404, "해당 게시글에 대한 권한이 없습니다.");
    throw error;
  }
  postRepo.updatePost(updateInfo, postId);
  if (updateInfo.is_deleted == true) {
    return { message: "게시글 삭제 완료" };
  } else if (updateInfo.is_deleted == false) {
    return { message: "게시글 복구 완료" };
  } else {
    return { message: "게시글 수정 완료" };
  }
}

module.exports = { createPostService, updatePostService };
