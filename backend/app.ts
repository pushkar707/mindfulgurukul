import express,{Request, Response} from "express"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import cors from "cors"
import User from "./models/User";
import JWT from "jsonwebtoken"
require('dotenv').config();
import SubUser from "./models/SubUser";

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/mindfulgurukul')
.then(() =>{
    console.log("Connected to database");
})
.catch((e) => {
    console.log(e);    
    console.log("Not connected");
})

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin:"http://localhost:19006"
}))

app.post("/signup",async(req:Request,res:Response) => {    
    try{        
        const {password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({...req.body, password:hashedPassword})
        if(process.env.JWT_SECRET_KEY){
            const accessToken = JWT.sign(user.id , process.env.JWT_SECRET_KEY)
            return res.json({success:true, message:"User created",accessToken})
        }else{
            throw new Error("JWT Secret not found")
        }
    }catch(e:any){
        return res.json({success:false,message:e.message})
    }
})

app.post("/login",async(req:Request,res:Response) => {
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user) 
        return res.json({error:true,message:"Invalid Credentials"})

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    console.log(isPasswordCorrect);    
    if(isPasswordCorrect){
        if(process.env.JWT_SECRET_KEY){
            const accessToken = JWT.sign(user.id , process.env.JWT_SECRET_KEY)
            return res.json({success:true,message:"User verified",accessToken})
        }else{
            throw new Error("JWT Secret not found")
        }
    }
    return res.json({error:true,message:"Invalid Credentials"})
})

app.post("/subuser/add",async(req:Request,res:Response)=> {
    const {username,email,phone,accessToken} = req.body
    if(!accessToken.length){
        return res.json({error:true,message:"User not verified"})
    }
    try{
        if( process.env.JWT_SECRET_KEY){
            const userId = JWT.verify(accessToken, process.env.JWT_SECRET_KEY)
            const subUser = await SubUser.create({email,phone,username})
            const user = await User.findByIdAndUpdate(userId,{$push:{subUsers:subUser.id}})
            if(!user)
                return res.json({error:true,message:"User not verified"})
            return res.json({success:true,message:"Subuser added"})      
        }else{
            throw new Error("JWT Secret not found")
        }
    }catch(e:any){
        return res.json({success:false,message:e.message})
    }
})

app.post("/subuser/all",async(req:Request,res:Response) => {
    const {accessToken} = req.body
    if(process.env.JWT_SECRET_KEY){
        const userId = JWT.verify(accessToken, process.env.JWT_SECRET_KEY)
        const user = await User.findById(userId).populate("subUsers")
        if(!user)
            return res.json({error:true,message:"User not found"})
        return res.json({success:true, subUsers: user.subUsers})
    }else{
        throw new Error("JWT Secret not found")
    }
})

app.listen(3000,() => {
    console.log("Listening on port 3000");
    
})