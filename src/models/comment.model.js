import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
    comment: String,
    userId: String,
    postId: {
        type: Schema.Types.ObjectId,
        ref : "Comment"
    },
    time: Number,
    date: String
}, {timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)