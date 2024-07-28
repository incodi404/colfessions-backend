import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asynchandler } from "../utils/asynchandler.utils.js";
import {Comment} from "../models/comment.model.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { timeStamp } from "../utils/date.utils.js";

const createComment = asynchandler(async(req,res)=>{
    const {comment, slug} = req.body

    const user = req['user']['_id']

    if(!user || !comment || !slug) {return res.status(400).json(ApiError(400, "Comment, slug and user is required!"))}

    const post = await Post.findById(slug)

    if(!post) {return res.status(400).json(ApiError(400, "Post not found!"))}

    const {time, customDate} = timeStamp()

    const commmented = await Comment.create({
        comment: comment,
        postId: slug,
        userId: user,
        time: time,
        date: customDate
    })

    if(!commmented) {return res.status(500).json(ApiError(500, "Comment failed!"))}

    return res.status(200).json(ApiResponse(200, "Comment successfull!"))
})

const deleteComment = asynchandler(async(req,res)=>{
    const {commentId} = req.body

    if(!commentId) {return res.status(400).json(ApiError(400, "Comment id is required!"))}

    const user = req['user']['_id']

    if(!commentId) {return res.status(400).json(ApiError(400, "Comment id is required!"))}

    const deletedComment = await Comment.deleteMany({userId: user, _id: commentId})

    if(!deletedComment) {return res.status(500).json(ApiError(500, "Comment delete failed!"))}

    if(deletedComment.deletedCount === 0) {return res.status(403).json(ApiError(403, "Unauthorized action!"))}

    return res.status(200).json(ApiResponse(200, "Comment deleted!", deletedComment))
})

const updateComment = asynchandler(async(req,res)=>{
    const {commentId, comment} = req.body

    const user = req['user']['_id']

    if(!user) {return res.status(400).json(ApiError(400, "User not found!"))}

    if(!commentId || !comment) {return res.status(400).json(ApiError(400, "Slug and updated post is required"))}

    const updatedPost = await Comment.updateMany({userId: user, _id: commentId}, {comment: comment})

    if(updatedPost.modifiedCount === 0) {return res.status(400).json(ApiError(400, "User or slug is wrong!"))}

    return res.status(200).json(ApiResponse(200, "Your post is updated!", updatedPost))
})

export {
    createComment,
    deleteComment,
    updateComment
}