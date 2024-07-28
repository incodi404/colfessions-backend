import express from "express"
import cors from "cors"
import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import cookieSession from "cookie-session"
import cookieParser from "cookie-parser"

passport.use(new Strategy({
    callbackURL: "https://colfessions-backend.vercel.app/auth/google/callback",
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done)=>{
    //console.log(profile)
    return done(null, profile)
}))

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

const app = express()

app.use(express.json({limit: "50kb"}))
app.use(express.urlencoded({limit: "50kb", extended: true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieSession({
    name: 'colsession',
    keys: [process.env.SESSION_KEY_ONE, process.env.SESSION_KEY_TWO],
    httpOnly: true,
    secure:true,
    maxAge: 24*60*60*1000
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

app.get("/failed", (req,res)=>{
    res.status(404).json({status: "failed"})
})
app.get("/success", (req,res)=>{
    console.log(req.user);
    res.status(200).json({status: "success"})
})

//import routers
import { userRouter } from "./routes/user.route.js"
import { authRouter } from "./routes/auth.route.js"
import { postRouter } from "./routes/post.route.js"
import { followRouter } from "./routes/follow.router.js"
import { getRouter } from "./routes/get.router.js"

//routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/institution", followRouter)
app.use("/api/v1/get", getRouter)

//auth routes
app.use("/auth", authRouter)

export {app}