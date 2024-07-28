import { Router } from "express";
import { follow, unfollow } from "../controllers/follow.controller.js";
import { verifyLogin } from "../middlewares/verifyLogin.middleware.js";

const followRouter = Router()

followRouter.route("/follow").post(verifyLogin,follow)
followRouter.route("/unfollow").delete(verifyLogin, unfollow)

export {followRouter}