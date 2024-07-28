import { Router } from "express";
import { comments, institutionList, myComments, newsFeed } from "../controllers/get.controller.js";
import { verifyLogin } from "../middlewares/verifyLogin.middleware.js";

const getRouter = Router()

getRouter.route("/newsfeed/:page").get(verifyLogin, newsFeed)
getRouter.route("/institution-list").get(verifyLogin, institutionList)
getRouter.route("/all-comments/:postId").get(verifyLogin, comments)
getRouter.route("/my-comments/:postId").get(verifyLogin, myComments)

export {
    getRouter
}