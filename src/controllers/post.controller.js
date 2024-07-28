import { ApiError } from "../utils/ApiError.utils.js"
import {asynchandler} from "../utils/asynchandler.utils.js"
import { Post } from "../models/post.model.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { timeStamp } from "../utils/date.utils.js"
import {client} from "../db/redis.db.js"

const createPost = asynchandler(async(req,res)=>{
    const {inputPost} = req.body

    if(!inputPost) {return res.status(400).json(ApiError(400, "Post is required!"))}

    const user = req["user"]

    const {time, customDate} = timeStamp()

    const post = await Post.create({
        post: inputPost,
        userId: user['_id'],
        institution: user["institution"],
        time: time,
        date: customDate
    })

    if(!post) {return res.status(500).json(ApiError(500, "Post save failed!"))}

    client.json.del(`colfessions:newsfeed:${user['_id']}`).catch((error)=>{
        console.log(error);
    })

    return res
        .status(200)
        .json(ApiResponse(200, "Post successfull!", post))

})

const deletePost = asynchandler(async(req,res)=>{
    const {slug} = req.body

    if(!slug) {return res.status(400).json(ApiError(400, "Slug is required!"))}

    const userId = req['user']['_id']

    if(!userId) {return res.status(400).json(ApiError(400, "User not found!"))}
    
    const deletedPost = await Post.deleteMany({userId: userId, _id: slug})

    if(!deletedPost) {return res.status(500).json(ApiError(500, "Delete post failed!"))}

    if(deletedPost.deletedCount === 0) {return res.status(400).json(ApiError(400, "Username or slug is wrong!"))}

    return res.status(200).json(ApiResponse(200, "Post delete successfull!"))
})

const updatePost = asynchandler(async(req,res)=>{
    const {slug, post} = req.body

    const user = req['user']['_id']

    if(!user) {return res.status(400).json(ApiError(400, "User not found!"))}

    if(!slug || !post) {return res.status(400).json(ApiError(400, "Slug and updated post is required"))}

    const updatedPost = await Post.updateMany({userId: user, _id: slug}, {post: post})

    if(updatedPost.modifiedCount === 0) {return res.status(400).json(ApiError(400, "User or slug is wrong!"))}

    return res.status(200).json(ApiResponse(200, "Your post is updated!", updatedPost))
})

export {
    createPost,
    deletePost,
    updatePost
}