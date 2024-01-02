import { Schema, model } from "mongoose";

const subUserSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
})

const SubUser = model("SubUser",subUserSchema)
export default SubUser