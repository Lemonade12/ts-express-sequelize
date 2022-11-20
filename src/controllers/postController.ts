import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import { UpdateInfoDTO, CreateInfoDTO } from "../interfaces/post";
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
/*

async function readPostList(req, res) {
  try {
    const condition = {
      search: req.query.search,
      orderBy: req.query.orderBy,
      order: req.query.order,
      hastags: req.query.hastags,
      page: req.query.page,
      limit: req.query.limit,
    };
    console.log(condition);
    const data = await postService.readPostList(condition);
    return res.status(StatusCodes.OK).send({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}*/

module.exports = {
  createPostController,
  updatePostController,
  readPostController,
  likeController,
};
