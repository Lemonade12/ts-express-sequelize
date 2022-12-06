import { Request, Response, NextFunction } from "express";
const postRepo = require("../repository/postRepository");
const redisClient = require("../../database/redis");

async function hitRankCacheCheck(req: Request, res: Response, next: NextFunction) {
  console.log("cache check");
  const isExistedList: number = await redisClient.zCard("topHitList");
  // redis에 없으면
  if (!isExistedList) {
    console.log("cache check : not in redis");
    // db에서 가져와서
    const list = await postRepo.readHitRank();
    // redis에 업데이트
    for (let i = 0; i < list.length; i++) {
      await redisClient.zAdd("topHitList", [
        {
          value: String(list[i].id),
          score: list[i].hit,
        },
      ]);
    }
  }
  next();
}

module.exports = { hitRankCacheCheck };
