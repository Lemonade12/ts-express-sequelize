import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import {
  UpdateInfoDTO,
  CreateInfoDTO,
  ListCondition,
  commentInfoDTO,
  alarmInfoDTO,
} from "../interfaces/post";
import { body, validationResult } from "express-validator";

const postRepo = require("../repository/postRepository");
const postService = require("../services/postService");

async function createPostController(req: Request, res: Response) {
  try {
    const userId: number = req.userId;
    const postInfo: CreateInfoDTO = req.body.data;
    const postId: number = await postService.createPostService(postInfo, userId);
    if (req.files) {
      (req.files as Express.Multer.File[]).map(async (data) => {
        const originalName = data.originalname.normalize("NFC");
        const fileName = data.filename.normalize("NFC");
        const file = {
          post_id: postId,
          user_id: userId,
          origin_file_nm: originalName,
          save_file_nm: fileName,
          file_extension: data.mimetype.slice(-3),
          file_size: data.size,
        };
        await postRepo.uploadFile(file);
      });
    }
    return res.status(201).json({ message: "게시물이 등록되었습니다." });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function updatePostController(req: Request, res: Response) {
  try {
    const updateInfo: UpdateInfoDTO = req.body;
    const userId: number = req.userId;
    const postId: number = Number(req.params.id);
    const data = await postService.updatePostService(updateInfo, userId, postId);
    return res.status(StatusCodes.OK).send(data);
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readPostController(req: Request, res: Response) {
  try {
    const postId: number = Number(req.params.id);
    const data = await postService.readPostService(postId);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function likeController(req: Request, res: Response) {
  try {
    const postId: number = Number(req.params.id);
    const userId: number = req.userId;
    const data = await postService.likePost(postId, userId);
    return res.status(StatusCodes.OK).send(data);
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readPostListController(req: Request, res: Response) {
  try {
    const condition: ListCondition = {
      search: req.query.search as string,
      orderBy: req.query.orderBy as string,
      order: req.query.order as string,
      hastags: req.query.hastags as string,
      page: Number(req.query.page as string),
      limit: Number(req.query.limit as string),
    };
    console.log(condition);
    const data = await postService.readPostListService(condition);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readHitRankController(req: Request, res: Response) {
  try {
    const data = await postService.readHitRankService();
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function createCommentController(req: Request, res: Response) {
  try {
    const userId: number = req.userId;
    const content: string = req.body.content;
    const commentInfo: commentInfoDTO = {
      postId: req.body.postId,
      userId: userId,
      content: req.body.content,
    };
    const newComment = await postService.createCommentService(commentInfo);

    const alarmInfo: alarmInfoDTO = {
      userId: userId,
      commentId: newComment.id as number,
    };
    const newAlarm = await postService.createCommentAlarmService(alarmInfo);
    return res.status(201).json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readAlarmListController(req: Request, res: Response) {
  try {
    const userId: number = req.userId;
    const data = await postService.readAlarmListService(userId);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readAlarmController(req: Request, res: Response) {
  try {
    const alarmId: number = Number(req.params.id);
    const data = await postService.readAlarmService(alarmId);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  createPostController,
  updatePostController,
  readPostController,
  likeController,
  readPostListController,
  readHitRankController,
  createCommentController,
  readAlarmListController,
  readAlarmController,
};
