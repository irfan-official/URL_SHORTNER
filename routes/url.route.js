import express from "express";
const router = express.Router();
import {
  createURL,
  postCreateMiddleware,
  analytics,
  alls,
  allUser,
} from "../controllers/url.controller.js";

router.post("/", postCreateMiddleware, createURL);
router.get("/api/:checkURL", analytics);
router.get("/alls", alls);
router.get("/check", allUser);
export default router;
