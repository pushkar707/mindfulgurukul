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
})

const SubUser = model("SubUser",subUserSchema)
export default SubUser