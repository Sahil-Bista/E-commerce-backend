export const verifyRoles = (...allowedRoles) =>{
    return (req,res,next)=>{
        const userRoles = req.roles;
        if(!req.roles) return res.sendStatus(401);
        const match = userRoles.some((role)=>allowedRoles.includes(role))
        if(!match) return res.sendStatus(403);
        next();
    }
}