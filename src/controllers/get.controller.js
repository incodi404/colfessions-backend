import { asynchandler } from "../utils/asynchandler.utils.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { User } from "../models/user.model.js"
import { Follow } from "../models/follow.model.js"
import { getCacheData, setCacheData } from "../utils/cache.utils.js"
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose"

function splitData(page, limit, data) {
  const initialData = data
  page = Number(page)
  const totalPosts = initialData?.length
  const totalPages = Math.ceil((totalPosts / limit))

  if (page > totalPages || page === 0) {
    return null
  }

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const newData = initialData.slice(startIndex, endIndex)

  return {
    totalPages,
    newData
  }
}


const newsFeed = asynchandler(async (req, res) => {

  const { page } = req.params

  const user = req['user']['_id']

  if (!user) { return res.status(400).json(ApiError(400, "User not found!")) }

  const cacheNewsfeed = await getCacheData("newsfeed", user)

  if (cacheNewsfeed) {
    const splitedData = splitData(page, 3, cacheNewsfeed)

    if (!splitedData) {
      return res.status(400).json(ApiError(400, "Page not found!"))
    }

    return res.status(200).json(ApiResponse(200, "Post fetched from cache!", {
      data: splitedData.newData,
      totalPages: splitedData.totalPages
    }))
  }

  const posts = await Follow.aggregate([
    {
      '$match': {
        'userId': `${user}`
      }
    }, {
      '$lookup': {
        'from': 'posts',
        'localField': 'instituition',
        'foreignField': 'institution',
        'as': 'posts'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'posts.userId',
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
      '$unwind': {
        'path': '$posts'
      }
    }, {
      '$addFields': {
        'postId': '$posts._id',
        'likes': '$posts.likes'
      }
    }, {
      '$lookup': {
        'from': 'comments',
        'localField': 'postId',
        'foreignField': 'postId',
        'as': 'comment'
      }
    }, {
      '$addFields': {
        'comments': {
          '$size': '$comment'
        },
        'likes': {
          '$size': '$likes'
        },
        'isLiked': {
          '$cond': {
            'if': {
              '$in': [
                `${user}`, '$likes'
              ]
            },
            'then': true,
            'else': false
          }
        }
      }
    }, {
      '$project': {
        'post_user': {
          'fullname': 0,
          'username': 0,
          'password': 0,
          'refreshToken': 0,
          'email': 0,
          'isAdmin': 0,
          '_id': 0
        },
        'user': 0,
        'comment': 0,
        'posts': {
          'likes': 0,
          'userId': 0
        },
        'userId': 0
      }
    }, {
      '$sort': {
        'posts.time': -1
      }
    }
  ])

  await setCacheData("newsfeed", user, posts, 1800)

  const newData = splitData(page, 3, posts)

  if (!posts) { return res.status(500).json(ApiError(500, "Post fetch failed")) }

  if (!newData) { return res.status(400).json(ApiError(400, "Page not found!")) }

  return res.status(200).json(ApiResponse(200, "Post fetched from MongoDB!", {
    data: newData.newData,
    totalPages: newData.totalPages
  }))
})

const institutionList = asynchandler(async (req, res) => {
  const user = req['user']['_id']

  if (!user) { return res.status(400).json(ApiError(400, "User not found!")) }

  const cacheData = await getCacheData("institutions_list", user)

  if (cacheData) {
    return res.status(200).json(ApiResponse(200, "List fetched from cache!", cacheData))
  }

  const list = await User.aggregate([
    {
      '$group': {
        '_id': '$institution'
      }
    }, {
      '$lookup': {
        'from': 'follows',
        'localField': '_id',
        'foreignField': 'instituition',
        'as': 'followerUsers'
      }
    }, {
      '$addFields': {
        'followers': {
          '$size': '$followerUsers'
        },
        'isFollower': {
          '$cond': {
            'if': {
              '$in': [
                `${user}`, '$followerUsers.userId'
              ]
            },
            'then': true,
            'else': false
          }
        }
      }
    }, {
      '$project': {
        'followerUsers': 0
      }
    }
  ])

  await setCacheData("institutions_list", user, list, 1800)

  if (!list) { return res.status(500).json(ApiError(500, "List not found!")) }

  return res.status(200).json(ApiResponse(200, "List fetched from database!", list))

})

const comments = asynchandler(async (req, res) => {
  const { postId } = req.params

  const allComments = await Comment.aggregate([
    {
      '$match': {
        'postId': new mongoose.Types.ObjectId(postId)
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
        'user': {
          '$first': '$user'
        }
      }
    }, {
      '$project': {
        'user': {
          'fullname': 0,
          '_id': 0,
          'email': 0,
          'isAdmin': 0
        }
      }
    }
  ])

  if (!allComments) { return res.status(400).json(ApiError(400, "Post not found")) }

  return res.status(200).json(ApiResponse(200, "Comments fetched", allComments))
})

const myComments = asynchandler(async (req, res) => {
  const { postId } = req.params
  const userId = req['user']['_id']

  const allComments = await Comment.aggregate([
    {
      '$match': {
        'postId': new mongoose.Types.ObjectId(postId)
      }
    }, {
      '$match' : {
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
        'user': {
          '$first': '$user'
        }
      }
    }, {
      '$project': {
        'user': {
          'fullname': 0,
          '_id': 0,
          'email': 0,
          'isAdmin': 0
        }
      }
    }
  ])

  if (!allComments) { return res.status(400).json(ApiError(400, "Post not found")) }

  return res.status(200).json(ApiResponse(200, "My comments fetched", allComments))
})

export {
  newsFeed,
  institutionList, 
  comments,
  myComments
}