import jwt from 'jsonwebtoken';

export const verifyJWT = async(req,res,next)=>{
        const authorization = req.headers.authorization || req.headers.Authorization;
        if(!authorization?.startsWith('Bearer ')) return res.sendStatus(403);
        const token = authorization.split(' ')[1]
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err,decoded) =>{
                if(err) {
                    console.log(err);
                    return res.status(403).json({msg:'User unauthorized'});
                }
                req.user = decoded.UserInfo.user;
                req.roles = decoded.UserInfo.roles;
                next();
            })
    }