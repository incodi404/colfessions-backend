import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asynchandler } from "../utils/asynchandler.utils.js"

const verifyLogin = asynchandler(async (req, res, next) => {
    if (!req.isAuthenticated() && !req.user) {
        return res.status(403).json(ApiError(403, "Not authenticated!"))
    }
    const user = await User.findById(req?.user)
    if (!user) { return res.status(403).json(ApiError(403, "User not found!")) }
    req.user = user
    next()
})

export { verifyLogin }