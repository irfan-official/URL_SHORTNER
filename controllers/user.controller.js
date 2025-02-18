import userModel from "../db/models/user.models.js";
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../service/service.auth.js";
import axios from "axios";

function deleteFields(jsonUser) {
  delete jsonUser.password;
  delete jsonUser.createdAt;
  delete jsonUser.updatedAt;
  delete jsonUser.__v;
  delete jsonUser.email;
  delete jsonUser.name;
  return jsonUser;
}

async function createUser(req, res) {
  try {
    const { name, email, password } = req.session.user;
    const user = await userModel.create({
      name,
      email,
      password,
    });

    let jsonUser = user.toObject();
    const jwtUser = deleteFields(jsonUser);
    const token = setUser(jwtUser);
    res.cookie("uid", token);
  } catch (err) {
    console.log(`createUser function error ==> ${err.message}`);
  }
  return;
}

export async function getEmailVerification(req, res) {
  const errorMessage = req.flash("email-code-error");
  return res.status(200).render("EmailVerification", {
    email: req.session.user.email,
    errorMessage: errorMessage || "",
  });
}

export async function postEmailVerification(req, res) {
  try {
    const { email_code } = req.body;
    if (email_code === req.session.user.code) {
      await createUser(req, res);
      return res.status(200).redirect("/");
    } else {
      req.flash("email-code-error", "wrong code");
      return res.status(302).redirect("/user/email-verification");
    }
  } catch (err) {
    console.log(`postEmailVerificationError ===> ${err.message}`);
  }
}

export async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  let check = await userModel.findOne({ email });

  if (check) {
    req.flash("email-existance-error", "user already exist!");
    return res.status(302).redirect("/user/signup");
  }

  let emailVerificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;
  req.session.user = { name, email, password, code: emailVerificationCode };

  try {
    const response = await axios.post(
      "https://email-code-sender-self.vercel.app//send-mail",
      {
        email: email,
        code: emailVerificationCode, // Generate a 6-digit code
      }
    );

    console.log("Response:", response.data);
    return res.status(200).redirect("/user/email-verification");
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
  }

  return res.status(200).redirect("/");
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email: email, password: password });
  //console.log(user);
  if (!user) {
    req.flash("login-error", "Invalid username or password");
    return res.status(404).redirect("/user/login");
  }
  let jsonUser = user.toObject();
  const jwtUser = deleteFields(jsonUser);
  const token = setUser(jwtUser);
  res.cookie("uid", token);
  return res.status(200).redirect("/");
}
export async function getSignup(req, res) {
  const errorMessage = req.flash("email-existance-error");
  return res.status(200).render("signup", { errorMessage: errorMessage || "" });
}

export async function getLogin(req, res) {
  const errorMessage = req.flash("login-error");
  return res.status(200).render("login", { errorMessage: errorMessage || "" });
}
