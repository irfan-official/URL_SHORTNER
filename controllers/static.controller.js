import URL from "../db/models/url.models.js";
import axios from "axios";
// import { secretID } from "../service/service.auth.js";
export async function def(req, res) {
  if (!req.user) {
    // secretID();
    return res.status(200).redirect("/user/login");
  }
  const allurls = await URL.find({ createdBy: req.user._id }); //createdBy: req.user._id

  return res
    .status(200)
    .render("home", { urls: allurls, id: req.flash("id")[0] });
}
export async function getURL(req, res) {
  try {
    let storedUrl = await URL.findOneAndUpdate(
      { shortId: req.params.url },
      {
        $push: {
          visitedHistory: { timestamp: Date.now() },
        },
      }
    );

    try {
      res.status(200).redirect(storedUrl.redirectURL);
      //res.status(200).send(response.data);
    } catch (err) {
      console.log(err.message);
      res.status(404).send(err.message);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "internal server error 3" });
  }
}

export async function fetchMiddleware(req, res, next) {
  var test = await URL.find({ shortId: req.params.url });
  try {
    if (test.length === 0) {
      return res.status(404).send("url not found");
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error 2" });
  }
}

export async function signup(req, res) {
  return res.status(200).render("signup");
}

export async function login(req, res) {
  return res.status(200).render("login");
}
