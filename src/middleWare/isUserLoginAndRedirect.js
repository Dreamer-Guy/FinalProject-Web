const BAD_REQUEST_STATUS=400;
const isUserLoginAndRedirect=(req,res,next)=>{
    console.log("fuck");
    if(!req.user){
        return res.redirect("/user/login");
    }
    next();
};


export default isUserLoginAndRedirect;