const noticeRepo = require("../repository/noticeRepository");
import ApiError from "../modules/api.error";
import { CreateInfoDTO, UpdateInfoDTO } from "../interfaces/post";

async function createNoticeService(noticeInfo: CreateInfoDTO, userId: number) {
  const { title, content } = noticeInfo;
  if (!title || !content) {
    const error = new ApiError(400, "제목이나 내용을 입력해주세요.");
    throw error;
  }
  await noticeRepo.createNotice(title, content, userId);
}

async function updateNoticeService(updateInfo: UpdateInfoDTO, noticeId: number) {
  const noticeInfo = await noticeRepo.readNoticeById(noticeId);
  // 게시글 존재 유무 체크
  if (!noticeInfo) {
    const error = new ApiError(404, "존재하지 않는 게시글 입니다.");
    throw error;
  }

  await noticeRepo.updateNotice(updateInfo, noticeId);

  if (updateInfo.is_deleted == true) {
    //이미 삭제된 게시글일 경우
    if (noticeInfo.is_deleted == true) {
      const error = new ApiError(400, "이미 삭제된 게시글 입니다.");
      throw error;
    }
    return { message: "게시글 삭제 완료" };
  } else if (updateInfo.is_deleted == false) {
    //이미 복구된? 존재하는 게시글일 경우
    if (noticeInfo.is_deleted == false) {
      const error = new ApiError(400, "이미 복구된(존재하는) 게시글 입니다.");
      throw error;
    }
    return { message: "게시글 복구 완료" };
  } else {
    return { message: "게시글 수정 완료" };
  }
}

async function readNoticeService(noticeId: number) {
  const noticeInfo = await noticeRepo.readNoticeById(noticeId);
  if (!noticeInfo || noticeInfo.is_deleted == 1) {
    // 게시글이 존재하지 않거나 삭제된 게시글인 경우
    const error = new ApiError(404, "존재하지 않는 공지글 입니다.");
    throw error;
  }
  //조회수 업데이트
  const updateInfo: UpdateInfoDTO = {
    hit: noticeInfo.hit + 1,
  };
  noticeInfo.hit++;
  noticeRepo.updateNotice(updateInfo, noticeId);
  return noticeInfo;
}

module.exports = { createNoticeService, updateNoticeService, readNoticeService };
