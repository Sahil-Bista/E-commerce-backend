import { UserModel } from "../models/User.js";

export const logOut = async(req , res)=>{
    const cookies = req.cookie;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const foundUser = await UserModel.findOne({refreshToken});
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly : true});
        return res.sendStatus(204);
    }
    foundUser.refreshToken = ' ';
    foundUser.save();
    res.clearCookie('jwt',{httpOnly:true});
    return res.sendStatus(204);
}