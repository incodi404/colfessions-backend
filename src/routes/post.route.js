import { Router } from "express";
import { createPost, deletePost, updatePost } from "../controllers/post.controller.js";
import { verifyLogin } from "../middlewares/verifyLogin.middleware.js";
import { createComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
import { dislike, like } from "../controllers/like.controller.js";

const postRouter = Router()

postRouter.route("/create-post").post(verifyLogin, createPost)
postRouter.route("/update-post").put(verifyLogin, updatePost)
postRouter.route("/delete-post").delete(verifyLogin, deletePost)

postRouter.route("/create-comment").post(verifyLogin, createComment)
postRouter.route("/delete-comment").delete(verifyLogin, deleteComment)
postRouter.route("/update-comment").put(verifyLogin, updateComment)

postRouter.route("/like/:slug").get(verifyLogin, like)
postRouter.route("/dislike/:slug").get(verifyLogin, dislike)

export { postRouter }