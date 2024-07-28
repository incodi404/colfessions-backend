import { client } from "../db/redis.db.js"

async function getCacheData(folder, userId) {
    const cacheNewsfeed = await client.json.get(`colfessions:${folder}:${userId}`)

    return cacheNewsfeed
}

async function setCacheData(folder, userId, data, expiry) {
    client.json.set(`colfessions:${folder}:${userId}`, '$', data, 'nx').then((data) => {
        if (!data) { return res.status(500).json(ApiError(500, "Data save failed in redis!")) }

        client.expire(`colfessions:${folder}:${userId}`, expiry).catch((error) => {
            return res.status(500).json(ApiError(500, "Expiry set failed in redis!"))
        })
    })
} 

export {
    getCacheData,
    setCacheData
}