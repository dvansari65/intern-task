import express from  "express"
import cors from "cors"

const app = express()


app.use(cors({
    origin:"https://localhost:5173",
    credentials:true
}))
app.use(express.json())




export default app