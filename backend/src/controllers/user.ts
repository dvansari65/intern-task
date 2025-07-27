import { User } from "../models/user.model";
import { Request ,Response} from "express";
import { loginUserProps, registerUserProps } from "../types/user.types";
import { Enroll } from "../models/enrollment.model";

export const createUser = async (req: Request<{},{},registerUserProps>, res: Response): Promise<void> => {
    try {
      const { userName, email, password, skills, education, experience } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { userName }] 
      });
      
      if (existingUser) {
        res.status(400).json({ 
          success: false,
          message: 'User with this email or username already exists' 
        });
        return;
      }
      
      const newUser = new User({
        userName,
        email,
        password, 
        skills: skills || [],
        education: education || '',
        experience: experience || ''
      });
  
      await newUser.save();
      let user ;
      if(newUser){
        user = await User.findOne({userName}).select("-password")
      }
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error: any) {
      console.error('Create user error:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
        return;
      }
  
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  };
  

  export const login = async(req:Request<{},{},loginUserProps>,res:Response)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(403).json({
                message:"please provide all the fields!",
                success:false
            })
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(401).json({
                message:"user not exist!",
                success:false
            })
        }
        const user = await User.create({
            email,
            password
        })
    } catch (error) {
        
    }
  }

