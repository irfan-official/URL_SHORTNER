import dotenv from "dotenv";
dotenv.config();
import dbconnection from "./db/connections/db.connection.js";
import express from "express";
import cookieParser from "cookie-parser";
import { logReqResDocument } from "./middlewares/index.js";
import path from "path";
import urlRoute from "./routes/url.route.js";
import staticRoute from "./routes/staticRouter.js";
import userRoute from "./routes/user.router.js";
import session from "express-session";
import flash from "connect-flash";

import { restrictToLoggedUserOnly, checkAuth } from "./middlewares/auth.js";
const app = express();
dbconnection();
app.use(
  session({
    secret: process.env.SECRET_KEY || "your-secret-key", // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set to true if using HTTPS
  })
);

app.use(flash());
app.use(logReqResDocument);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/url", restrictToLoggedUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.listen(process.env.PORT, () =>
  console.log(`server started at http://localhost:${process.env.PORT}`)
);
