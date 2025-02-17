import userModel from "../db/models/user.models.js";
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../service/service.auth.js";

function deleteFields(jsonUser) {
  delete jsonUser.password;
  delete jsonUser.createdAt;
  delete jsonUser.updatedAt;
  delete jsonUser.__v;
  delete jsonUser.email;
  delete jsonUser.name;
  return jsonUser;
}

export async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  const user = await userModel.create({
    name: name,
    email: email,
    password: password,
  });
  // console.log(user);
  let jsonUser = user.toObject();
  const jwtUser = deleteFields(jsonUser);
  const token = setUser(jwtUser);
  res.cookie("uid", token);
  return res.status(200).redirect("/");
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email: email, password: password });
  console.log(user);
  if (user === null) {
    return res
      .status(404)
      .render("login", { error: "Invalid username or password" });
  }
  let jsonUser = user.toObject();
  const jwtUser = deleteFields(jsonUser);
  const token = setUser(jwtUser);
  res.cookie("uid", token);
  return res.status(200).redirect("/");
}
