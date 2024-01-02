import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Others"],
        required:true,
    },
    hearAbout: {
        type: Array,
        required:true,
    },
    city: {
        type: String,
        enum: ["Mumbai","Pune","Ahemadabad"],
        required:true,
    },
    state: {
        type: String,
        required:true,
    },
    subUsers:{
        type: Schema.Types.ObjectId,
        ref:"SubUser"
    }
})

const User = model("User",userSchema)
export default User