import express from "express";
const router = express.Router();

import {
  def,
  getURL,
  fetchMiddleware,
} from "../controllers/static.controller.js";

router.get("/", def);
router.get("/:url", fetchMiddleware, getURL);

export default router;
