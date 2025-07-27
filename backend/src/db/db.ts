import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import app from "../app";


export const MongoDB = async ()=>{
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI as string}/${DB_NAME}`)
       app.listen(process.env.MONGODB_URI,()=>{
        console.log(`db connected on host : ${db.connection.host}`)
       })

    } catch (error) {
        console.log("failed to connect database!",error)
        process.exit(1)
    }
}