import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
      trim: true,
    },
    visitedHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Url = new mongoose.model("Url", urlSchema);

export default Url;
