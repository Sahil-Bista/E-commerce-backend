import { UserModel } from "../models/User.js"
import bcrypt from 'bcrypt';

export const registerUser = async(req,res)=>{
    try{
        const { email, password, firstName, lastName, phoneNumber, roles} = req.body;
        console.log('password',password);
        if (!email || !password || !firstName || !lastName || !phoneNumber){
            return res.status(400).json({msg:"All fields are required"});
        }
        const duplicate = await UserModel.findOne({email});
        if(duplicate){
            return res.status(409).json({msg:'User with the email already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            email: email,
            password : hashedPassword,
            firstName : firstName,
            lastName : lastName,
            phoneNumber : phoneNumber,
            roles : roles
        });
        return res.json({msg:'new User created', data: newUser});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}