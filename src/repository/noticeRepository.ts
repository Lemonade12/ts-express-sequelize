import { CreateInfoDTO, UpdateInfoDTO, ListCondition } from "../interfaces/post";

const db = require("../../database/index");
const notice = db.notice;

async function createNotice(title: string, content: string, userId: number) {
  return notice.create({
    title: title,
    content: content,
    user_id: userId,
  });
}

async function updateNotice(updateInfo: UpdateInfoDTO, noticeId: number) {
  return notice.update(updateInfo, {
    where: {
      id: noticeId,
    },
  });
}

async function readNoticeById(noticeId: number) {
  const data = await notice.findOne({
    where: { id: noticeId },
    raw: true,
  });
  return data;
}

module.exports = { createNotice, updateNotice, readNoticeById };
