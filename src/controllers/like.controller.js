import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asynchandler } from "../utils/asynchandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const like = asynchandler(async(req,res)=>{
    const {slug} = req.params
    const userId = req['user']['_id']

    if(!slug) {return res.status(400).json(ApiError(400, "Post Id is requiered"))}

    const post = await Post.findOne({_id: slug})

    post.likes.push(userId)
    await post.save()

    return res.status(200).json(ApiResponse(200, "Liked!", post.likes))


})

const dislike = asynchandler(async(req,res)=>{
    const {slug} = req.params
    const userId = req['user']['_id']

    if(!slug) {return res.status(400).json(ApiError(400, "Post Id is requiered"))}

    const post = await Post.findOne({_id: slug})

    if(!post) {return res.status(400).json(ApiError(400, "Post not found"))}


    post.likes.pop(userId)
    await post.save()

    return res.status(200).json(ApiResponse(200, "Disliked!", post.likes))


})

export{
    like,
    dislike
}