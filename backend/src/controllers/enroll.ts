import { Request,Response } from "express"
import mongoose from "mongoose";
import { Enroll } from "../models/enrollment.model";
import { Project } from "../models/project.model";

export const makeEnrollment = async(req:Request,res:Response)=>{
    try {
        const { projectId, llmScore } = req.body;
        
        const userId = req.user?._id;
    
        if (!userId) {
          res.status(401).json({
            success: false,
            message: "User authentication required"
          });
          return;
        }
    
        if (!projectId) {
          res.status(400).json({
            success: false,
            message: "Project ID is required"
          });
          return;
        }
    
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
          res.status(400).json({
            success: false,
            message: "Invalid project ID format"
          });
          return;
        }
        const existingProject = await Project.findById(projectId)
        if(!existingProject) {
            return res.status(404).json({
                message:"projct not found!",
                success:false
            })
        } 
        const existingEnrollment = await Enroll.findOne({
          user: userId,
          project: projectId
        });
    
        if (existingEnrollment) {
          res.status(409).json({
            success: false,
            message: "You have already enrolled in this project",
            data: {
              enrollmentId: existingEnrollment._id,
              status: existingEnrollment.status,
              enrolledAt: existingEnrollment.createdAt
            }
          });
          return;
        }

        const enrollmentData: any = {
          user: userId,
          project: projectId,
          status: "pending",
          interview: {
            scheduled: false
          }
        };
    
        if (llmScore) {
          if (typeof llmScore.type !== 'number' || typeof llmScore.reason !== 'string') {
            res.status(400).json({
              success: false,
              message: "LLM score must have 'type' (number) and 'reason' (string)"
            });
            return;
          }
    
          if (llmScore.type < 0 || llmScore.type > 100) {
            res.status(400).json({
              success: false,
              message: "LLM score must be between 0 and 100"
            });
            return;
          }
    
          if (llmScore.reason.length < 8) {
            res.status(400).json({
              success: false,
              message: "LLM score reason must be at least 8 characters"
            });
            return;
          }
    
          enrollmentData.llmScore = {
            type: llmScore.type,
            reason: llmScore.reason.trim()
          };
        }
    
        const newEnrollment = new Enroll(enrollmentData);
        await newEnrollment.save();
    
        const populatedEnrollment = await Enroll.findById(newEnrollment._id)
          .populate('user', 'userName email')
          .populate('project', 'title description')
         await Project.findByIdAndUpdate(
            projectId,
            {
                $inc:{
                    slotsLeft:-1
                }
            }
         )
        
        res.status(201).json({
          success: true,
          message: "Enrollment created successfully",
          data: populatedEnrollment,
          slotsLeft : existingProject?.slotsLeft
        });
    
      } catch (error: any) {
        console.error("Enrollment creation error:", error);
    
        if (error.code === 11000) {
          res.status(409).json({
            success: false,
            message: "You have already enrolled in this project"
          });
          return;
        }
    
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map((err: any) => err.message);
          res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationErrors
          });
          return;
        }
    
        if (error.name === 'CastError') {
          res.status(400).json({
            success: false,
            message: "Invalid ID format"
          });
          return;
        }
    
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message
        });
      }
    };
    
