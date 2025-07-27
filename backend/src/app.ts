import express from  "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cookieParser())
app.use(cors({
    origin:"https://localhost:5173",
    credentials:true
}))
app.use(express.json())




export default app