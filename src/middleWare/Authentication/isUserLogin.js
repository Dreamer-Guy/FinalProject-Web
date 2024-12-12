const BAD_REQUEST_STATUS=400;
const isUserLogin=(req,res,next)=>{
    if(!req.user){
        return res.status(BAD_REQUEST_STATUS).send({
            message:"You need to login first",
        });
    }
    next();
};


export default isUserLogin;