import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";

const esClient = require("../../database/elastic");

async function readSearchLogsController(req: Request, res: Response) {
  try {
    const search = req.query.search as string;
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const data = await esClient.search({
      index: "search-logs-" + today,
      /*query: {
        match: {
          searchWord: search,
        },
      },*/
    });
    return res.status(StatusCodes.OK).send(data);
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function searchController(req: Request, res: Response) {
  try {
    const search = req.query.search as string;
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log(today);
    await esClient.index({
      index: "search-logs-" + today,
      document: {
        searchWord: search,
        timestamp: new Date(),
      },
    });
    return res.status(201).json({ message: "검색" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { readSearchLogsController, searchController };
