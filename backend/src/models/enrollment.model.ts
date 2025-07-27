import mongoose from "mongoose";


const Enroll = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user is required!"]
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:[true,"please select the project!"]
    },
    status: {
        type: String,
        enum: ['pending', 'interview_scheduled', 'approved', 'rejected'],
        default: 'pending',
      },
    interview: {
        scheduled:{
            type:Boolean,
            default:false
        },
        msTeamsEmail:{
            
        }
    }
},{timestamps:true})