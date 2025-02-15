import { getUser } from "../service/service.auth.js";

export function restrictToLoggedUserOnly(req, res, next) {
  console.log(req.cookies);
  const token = req.cookies?.uid;
  if (!token) return res.status(404).redirect("/user/login");
  const user = getUser(token);
  if (!user) return res.redirect("/user/login");
  req.user = user;
  next();
}
export function checkAuth(req, res, next) {
  const token = req.cookies?.uid;
  const user = getUser(token);
  req.user = user;
  next();
}
