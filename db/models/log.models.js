import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    path: { type: String, required: true },
    method: { type: String, required: true },
    status_code: { type: Number },
    original_IP: { type: String, required: true },
  },
  { timestamps: true }
);

const Log = new mongoose.model("Log", logSchema);

export default Log;
