import URL from "../db/models/url.models.js";
import shortid from "shortid";
import { getUser } from "../service/service.auth.js";
import UserModel from "../db/models/user.models.js";
export async function postCreateMiddleware(req, res, next) {
  if (!req.body || !req.body.url) {
    try {
      return res.status(400).json({ error: " enter valid url" });
    } catch (error) {
      console.log("error ==>", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  try {
    const response = await fetch(req.body.url);
    if (response.ok) {
      res.locals.id = req.flash("id");

      console.log("req.local.id ==== ", res.locals.id[0]);
      next();
    } else {
      return res.status(404).json({ error: "not valid url" });
    }
  } catch (err) {
    console.log("error ==>", err);
    return res.status(404).json({ error: `URL not active: ${req.body.url}` });
  }
}

export async function createURL(req, res) {
  try {
    const userUid = req.cookies.uid;
    const user = getUser(userUid);
    const shortId = shortid();
    await URL.create({
      shortId: shortId,
      redirectURL: req.body.url,
      createdBy: user._id,
    });
    req.flash("id", shortId);
    console.log("req.flash === ", req.flash);
    //const allUrls = await URL.find({ createdBy: user._id }); // problems 1
    //return res.status(200).render("home", { id: shortId, urls: allUrls }); // problems2
    return res.redirect("/");
  } catch (err) {
    return res.status(400).json({ error: "failed to create short URL" });
  }
}

export async function analytics(req, res) {
  let url = await URL.findOne({ shortId: req.params.checkURL });
  console.log(url);
  res.status(200).json({ totalClicks: url.visitedHistory.length, url });
}

export async function alls(req, res) {
  const urls = await URL.find({});

  return res.status(200).render("allurls", { urls: urls });
}

export async function allUser(req, res) {
  const allDetails = await URL.find({}).populate("createdBy");
  return res.status(200).json(allDetails);
}
