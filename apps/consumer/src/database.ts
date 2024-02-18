import { MongoClient } from "mongodb";

export async function connectToMongoDB() {
    try {
        const client = new MongoClient("mongodb://localhost:27017/screenshots");
        await client.connect();
        console.info("Connected to MongoDB");
        return client.db("SCREENSHOT_DB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}