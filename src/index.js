import { connectDb } from "./db/index.db.js"
import { app, options } from "./app.js"
import dotenv from "dotenv"
import { client } from "./db/redis.db.js"
import https from "https"

dotenv.config({
    path: "./.env"
})

try {
    await client.connect()
    console.log("Redis connection established!");
} catch (error) {
    console.log(`Redis connection error :: ${error}`);
}

try {
    connectDb()
        .then(() => {
            https.createServer(options, app).listen(process.env.PORT, () => {
                console.log("Listening on port ::", process.env.PORT);
            })
        })
} catch (error) {
    console.log("Server is not started :: ", error);
}

