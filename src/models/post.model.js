import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    post: {
        type: String
    },
    userId: {
        type: String
    },
    institution: {
        type: String
    },
    likes : [String],
    time: {
        type: Number
    },
    date: {
        type: String
    }
}, {timestamps: true})

export const Post = mongoose.model("Post", postSchema)