import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    _id: String,
    fullname: String,
    institution: String,
    department: String,
    age: Number,
    gender: String,
    email: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

export const User = mongoose.model("User", userSchema)