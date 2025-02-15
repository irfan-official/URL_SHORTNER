import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
// let secretKey;
const secretKey = "irfan";

// export function secretID() {
//   secretKey = uuidv4();
//   return secretKey;
// }

export function setUser(user) {
  // secretID();
  return jwt.sign(user, secretKey);
}
export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    console.log("Inavalid request");
    return null;
  }
}
