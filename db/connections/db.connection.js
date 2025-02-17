import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function () {
  mongoose
    .connect(process.env.dbUrl)
    .then(() => console.log(`connected to the short_url database`))
    .catch((err) => console.log("error ==>", err));
}
