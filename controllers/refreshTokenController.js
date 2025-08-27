import { UserModel } from "../models/User.js";

export const refreshTokenController = async(req,res)=>{
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        const foundUser = await UserModel.findOne({refreshToken});
        if(!refreshToken) return res.sendStatus(404);
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err,decoded)=>{
                if(err || foundUser.email != decoded.email) return res.sendStatus(403);
                const roles = foundUser.roles;
                const access_token = jwt.sign(
                    {
                        'UserInfo':{
                            'user':foundUser._id,
                            'roles':roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '1000s'}
                );
                return res.json(access_token);
            }
        )
    }catch(err){
        return res.status(500).json({msg:'Internal Server Error'});
    }
}