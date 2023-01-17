import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import { CreateInfoDTO, UpdateInfoDTO } from "../interfaces/post";

const noticeService = require("../services/noticeService");

async function createNoticeController(req: Request, res: Response) {
  try {
    const noticeInfo: CreateInfoDTO = req.body;
    const userId: number = req.userId;
    await noticeService.createNoticeService(noticeInfo, userId);
    return res.status(StatusCodes.OK).send({ message: "공지글 작성 완료" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function updateNoticeController(req: Request, res: Response) {
  try {
    const updateInfo: UpdateInfoDTO = req.body;
    const noticeId: number = Number(req.params.id);
    const data = await noticeService.updateNoticeService(updateInfo, noticeId);
    return res.status(StatusCodes.OK).send(data);
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readNoticeController(req: Request, res: Response) {
  try {
    const noticeId: number = Number(req.params.id);
    const data = await noticeService.readNoticeService(noticeId);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { createNoticeController, updateNoticeController, readNoticeController };
