import express from "express";
const router = express.Router();

import {
  def,
  getURL,
  fetchMiddleware,
  signup,
  login,
} from "../controllers/static.controller.js";

router.get("/", def);
router.get("/:url", fetchMiddleware, getURL);
router.get("/user/signup", signup);
router.get("/user/login", login);

export default router;
