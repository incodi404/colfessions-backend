import mongoose, {Schema} from "mongoose"

const followSchema = new Schema({
    instituition: String,
    userId: String
})

export const Follow = mongoose.model('Follow', followSchema)
