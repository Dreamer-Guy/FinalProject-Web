const BAD_REQUEST_STATUS=400;
const isAdmin=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(BAD_REQUEST_STATUS).send({
            message:"You don't have permission to access this route",
        });
    }
    next();
};


export default isAdmin;