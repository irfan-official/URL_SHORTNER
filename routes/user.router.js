import express from "express";
import {
  handleUserSignup,
  handleUserLogin,
  getSignup,
  getLogin,
  getEmailVerification,
  postEmailVerification,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/signup", checkAuth, getSignup);
router.get("/login", checkAuth, getLogin);
router.get("/email-verification", getEmailVerification);
router.post("/email-verification", postEmailVerification);
export default router;
