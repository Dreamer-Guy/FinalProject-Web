import serviceFactory from "../../Factory/serviceFactory.js";
import mongoose from "mongoose";
const userService  =serviceFactory.getUserService()
const ROW_PER_PAGE = 10;
const getAllUsers =async(req,res)=>{
try{
const user = req.user||null
const users = await userService.getAllUsers()
res.render('admin/users')
}
catch(e){
    console.error(e);
    return res.status(500).send({
        message: "Internal server error"
    });   
}
}
const getQueryParams = (req) => {
    const { page = 1, rowPerPage = ROW_PER_PAGE } = req.query;
    return {
        page: Number(page),
        rowPerPage: Number(rowPerPage),
    };
};
const getUsersApi = async (req, res) => {
    try {
        const {  page, rowPerPage} = getQueryParams(req);
        let users = await userService.getAllUsers()

        const totalUsers =users.length
        const paginatedUsers = users.slice(
            (page - 1) * rowPerPage,
            page * rowPerPage
        );
    

        return res.json({
            users: paginatedUsers,
            totalUsers,
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getUsersApi:", error);
        return res.status(500).json({ 
            message: error.message 
        });
    }
};
const HandlelockUser =async(req,res)=>{
    const userId = req.params.id
    const {status}= req.body
    try{
        const user = await userService.updateUserStatus(userId,status)
        return res.status(200).json({
            message:"Successful"
        })
    }
    catch(e){ 
        res.status(500).json({ message: 'Error deleting product' })
    }

};
export {getAllUsers,getUsersApi,HandlelockUser}