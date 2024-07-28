import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asynchandler } from "../utils/asynchandler.utils.js"
import { Post } from "../models/post.model.js"

const getUser = asynchandler(async (req, res) => {

    const userId = req['user']["_id"]

    if (!userId) { return res.status(400).json(ApiError(400, "Are you logged in? User not found")) }

    const user = await User.findById(userId)

    if (!user) { return res.status(400).json(ApiError(400, "User not found")) }

    return res.status(200).json(ApiResponse(200, "User fetched!", user))
})

const checkUser = asynchandler(async (req, res) => {
    const userId = req['user']['_json']['sub']
    const userEmail = req['user']['_json']['email']
    const userName = req['user']['_json']['name']

    if (!userId || !userEmail) { return res.status(500).json(ApiError(500, "Some data is empty in the callback!")) }

    const existedUser = await User.findById(userId)

    if (existedUser) {
        res.redirect(`${process.env.CLIENT_SERVER}`)
    }

    const user = await User.create({
        _id: userId,
        fullname: userName,
        email: userEmail
    })

    if (!user) { return res.status(500).json(ApiError(500, "User not created!")) }

    return res.redirect(`${process.env.CLIENT_SERVER}/user-info`)

    //return res.status(200).json(ApiResponse(200, "User information updated", req.user))
})

const userInfo = asynchandler(async (req, res) => {

    const { institution, department, age, gender } = req.body
    const userId = req['user']['_id']

    if (!institution || !department || !age || !gender) { return res.status(500).json(ApiError(500, "Every field is required")) }

    const info = await User.findByIdAndUpdate(userId, {
        institution: institution?.toLowerCase(),
        age: age,
        department: department?.toLowerCase(),
        gender: gender?.toLowerCase()
    }, {
        new: true
    })

    if (!info) { return res.status(500).json(ApiError(500, "User information not updated")) }

    return res.status(200).json(ApiResponse(200, "User information updated", info))

})

const myPost = asynchandler(async (req, res) => {
    const userId = req['user']['_id']

    if (!userId) { return res.status(400).json(ApiError(400, "Are you logged in? User not found")) }

    const posts = await Post.aggregate([
        {
            '$match': {
                'userId': userId
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$addFields': {
                'post_user': {
                    '$first': '$user'
                }
            }
        }, {
            '$addFields': {
                'likes': {
                    '$size': '$likes'
                }
            }
        }, {
            '$lookup': {
                'from': 'comments',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'comment'
            }
        }, {
            '$addFields': {
                'comment': {
                    '$size': '$comment'
                }
            }
        }, {
            '$project': {
                'user': 0,
                'post_user': {
                    '_id': 0,
                    'email': 0,
                    'isAdmin': 0,
                    '__v': 0
                }
            }
        }
    ])

    if (posts.length === 0) { return res.status(400).json(ApiError(400, "There is no post")) }

    return res.status(200).json(ApiResponse(200, "Posts fetched", posts))
})

export { getUser, checkUser, userInfo, myPost }