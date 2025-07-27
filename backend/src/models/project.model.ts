import mongoose from "mongoose";


const ProjectSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    totalSlots:{
        type:Number
    },
    slotsLeft:{
        type:Number
    },

    description:{
        type:String,
        maxlength:[150]
    }

},{timestamps:true})

export const Project = mongoose.model("Project",ProjectSchema)