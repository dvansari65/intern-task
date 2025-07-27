import { User } from "../models/user.model";
import { Request ,Response} from "express";
import { loginUserProps, registerUserProps } from "../types/user.types";
import { Enroll } from "../models/enrollment.model";
import ApiError from "../utils/errorHandler";

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
  const generateAccessAndRefreshToken = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError("user not found!", 404);
      }
      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();
      if (!refreshToken || !accessToken) {
        throw new ApiError("refreshToken or accessToken  can not generated", 402);
      }
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: true });
      return { refreshToken, accessToken };
    } catch (error) {
      console.error("failed to generate tokens", error);
      throw new ApiError("server error", 500);
    }
  };

  export const login = async(req:Request<{},{},loginUserProps>,res:Response)=>{
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApiError("please fill all the fields", 402);
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message:"user not found!",
          success:false
         })
      }
      // console.log("Found user:", { userName: user.userName, hasPassword: !!user.password });
      const isPasswordCorrect = await user.isPasswordCorrect(String(password));
      // console.log("Password comparison result:", isPasswordCorrect);
      if (isPasswordCorrect === false) {
        throw new ApiError("password is incorrect", 404);
      }
      // console.log("isPasswordCorrect", isPasswordCorrect)
      const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
        user?._id as string
      );
      const loggedInUser = await User.findById(user?._id).select("-password");
  
      return res
        .status(200)
        .cookie("refreshToken", refreshToken as string, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .cookie("accessToken", accessToken as string, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: `welcome!`,
          accessToken,
          user: loggedInUser,
        });
        
    } catch (error) {
        
    }
  }

