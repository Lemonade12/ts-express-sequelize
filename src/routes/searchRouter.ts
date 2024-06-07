import express from "express";
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/searchlogs", searchController.readSearchLogsController);
router.post("/search", searchController.searchController);

module.exports = router;
