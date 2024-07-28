import { Router } from "express";
import { verifyLogin } from "../middlewares/verifyLogin.middleware.js";
import { getUser, myPost, userInfo } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/get-user").get(verifyLogin, getUser)
userRouter.route("/user-info").post(verifyLogin, userInfo)
userRouter.route("/my-post").get(verifyLogin, myPost)

export {
    userRouter
}