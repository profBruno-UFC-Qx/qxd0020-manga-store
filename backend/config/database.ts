import 'dotenv/config'
import mongoose from "mongoose";

const DB_USERNAME = process.env.MONGO_USERNAME as string
const DB_PASSWORD = process.env.MONGO_PASSWORD as string
const DB_HOST = process.env.MONGO_HOST as string
const DB_PORT = process.env.MONGO_PORT as string
const DB_DATABASE = process.env.MONGO_DB as string

const MONGO_URI = `mongodb://${DB_HOST}:${DB_PORT}/`

export const connect = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: DB_DATABASE,
        })
        return mongoose.connection
    } catch (error) {
        console.log("Database connection failed.")
        console.log(error)
        process.exit(1)
    }
}