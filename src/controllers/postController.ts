import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import { body, validationResult } from "express-validator";

const postService = require("../services/postService");

async function createPost(req: Request, res: Response) {
  try {
    const { title, content, hastags } = req.body;
    const userId = req.userId;
    await postService.createPost(title, content, hastags, userId);
    return res.status(StatusCodes.OK).send({ message: "게시글 작성 완료" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

/*async function updatePost(req, res) {
  try {
    const updateInfo = req.body;
    const userId = req.userId;
    const postId = req.params.id;
    const data = await postService.updatePost(updateInfo, userId, postId);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readPost(req, res) {
  try {
    const postId = req.params.id;
    const data = await postService.readPost(postId);
    return res.status(StatusCodes.OK).send({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function likeController(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const data = await postService.likePost(postId, userId);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

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
  createPost,
};
