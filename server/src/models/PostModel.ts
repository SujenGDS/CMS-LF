import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  body: string;
  author: string;
  // category?: string;
  image?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    author: { type: String, required: true },
    // category: { type: String, default: "General" },
    image: { type: String },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema);
