import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
export const verifyJwt = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ","")
    
        if(!token){
           return res.status(404).json({
            message:"token not found!",
            success:false
           })
        }
        const secret = process.env.ACCESS_TOKEN_SECRET as string
       const decodedToken  = jwt.verify(token,secret) as jwt.JwtPayload
    
       if(typeof decodedToken === "string" || !("_id" in decodedToken)){
        return res.status(404).json({
            message:"invalid token payload!",
            success:false
           })
       }

       const user = await User.findById(decodedToken._id).select("-password -refreshToken")
       if(!user){
        return res.status(404).json({
            message:"user not found!",
            success:false
           })
       }
    
       req.user = user
       next()
    } catch (error:any) {
        console.log("JWT error:", error)

        if(error.name === "TokenExpiredError"){
             res.status(401).json({message:"access token expired!"})
             return;
        }
         res.status(401).json({message: "Invalid or missing token"})
         return;
    }
}