import express,{Request, Response} from "express"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import cors from "cors"
import User from "./models/User";

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
        await User.create({...req.body, password:hashedPassword})
        return res.json({success:true, message:"User created"})
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
    if(isPasswordCorrect)
        return res.json({success:true,message:"User verified"})
    return res.json({error:true,message:"Invalid Credentials"})
})

app.listen(3000,() => {
    console.log("Listening on port 3000");
    
})