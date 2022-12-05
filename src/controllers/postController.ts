import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import { UpdateInfoDTO, CreateInfoDTO, ListCondition } from "../interfaces/post";
import { body, validationResult } from "express-validator";

const postService = require("../services/postService");

async function createPostController(req: Request, res: Response) {
  try {
    const postInfo: CreateInfoDTO = req.body;
    const userId: number = req.userId;
    await postService.createPostService(postInfo, userId);
    return res.status(StatusCodes.OK).send({ message: "게시글 작성 완료" });
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

module.exports = {
  createPostController,
  updatePostController,
  readPostController,
  likeController,
  readPostListController,
  readHitRankController,
};
