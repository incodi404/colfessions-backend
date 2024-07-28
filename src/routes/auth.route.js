import { Router } from "express";
import passport from "passport";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { checkUser } from "../controllers/user.controller.js";

const authRouter = Router()

authRouter.route("/google").get(passport.authenticate('google', {
    scope: ['email']
}))

authRouter.route("/google/callback").get(passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_SERVER}/failed`,
}), checkUser)

authRouter.route("/logout").get((req,res)=>{
    req.logout()
    return res.status(200).json(ApiResponse(200, "User logged out!"))
})

export { authRouter }