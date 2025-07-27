import dotenv from "dotenv" 
import { MongoDB } from "./db/db"
import app from "./app"


dotenv.config({
    path:"./.env"
})

MongoDB()
.then(()=>{
    app.listen(process.env.MONGODB_URI,()=>{
        console.log(`server is running on : ${process.env.PORT || 5000}`)
    })
})
.catch((error)=>{
    console.log("error:",error)
    app.on("error",()=>{
        console.log("error")
        throw error
    })
})