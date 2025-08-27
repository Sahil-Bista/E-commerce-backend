import { UserModel } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const userlogin = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({msg:'Email and password required'});
        const foundUser = await UserModel.findOne({email});
        if(!foundUser){
            return res.status(404).json({msg:'user with this email does not exist'});
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch){
            return res.status(401).json({msg:'User password is incorrect'});
        }
        const userRoles = foundUser.roles;
        const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "user":foundUser._id,
                        "roles" : userRoles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET ,
                {expiresIn:'100000s'}
            );
        const refreshToken = jwt.sign(
            {"email": foundUser.email},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : '1d'}
        );
        foundUser.refreshToken = refreshToken;
        foundUser.save();
        res.cookie('jwt',refreshToken,{httpOnly : true, maxAge : 24*60*60*1000})
        return res.json({accessToken});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal server error'});
    }
}