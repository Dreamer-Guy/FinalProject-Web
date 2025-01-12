import serviceFactory from "../../Factory/serviceFactory.js";

const userService = serviceFactory.getUserService()
const addressService = serviceFactory.getAddressService()
const orderService = serviceFactory.getOrderService()
const ROW_PER_PAGE = 10;

const getAllUsers =async(req,res)=>{
    try{
        const user = req.user||null
        if(!user){
            return res.redirect("/login")
        }
        res.render('admin/users');
    }
    catch(e){
        console.error(e);
        return res.status(500).send({
            message: "Internal server error"
        });   
    }
}

const getQueryParams = (req) => {
    const { page = 1, rowPerPage = ROW_PER_PAGE,search,sortFullName,sortEmail,sortCreatedAt } = req.query;
    return {
        page: Number(page),
        rowPerPage: Number(rowPerPage),
        search: search || '',
        sortFullName: sortFullName,
        sortEmail: sortEmail,
        sortCreatedAt: sortCreatedAt
    };
};

const getUsersApi = async (req, res) => {
    try {
        const user = req.user||null
        if(!user){
        return res.redirect("/login")
        }
       const {  page, rowPerPage,search,sortFullName,sortEmail,sortCreatedAt} = getQueryParams(req);
       let sortOptions={}
       if(sortFullName){
        sortOptions.fullName=sortFullName==='asc'?1:-1
       }
       if(sortEmail){
        sortOptions.email=sortEmail==='asc'?1:-1
       }
       if(sortCreatedAt){
        sortOptions.createdAt=sortCreatedAt==='asc'?1:-1
       }

       const result = await userService.getUsersApi(search,sortOptions,page,rowPerPage,user._id)

        return res.status(200).json({
            users: result.users,
            totalUsers:result.totalUsers,
            currentPage: result.currentPage,
            totalPages:result.totalPages
        });
    } catch (error) {
        console.error("Error in getUsersApi:", error);
        return res.status(500).json({ 
            message: error.message 
        });
    }
};
const getUserDetail = async (req, res) => {
    try{
        const userId = req.params.id
        const user =await userService.getUserById(userId)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const address =await addressService.getAddressByUserId(userId)
        const orders =await orderService.getOrdersByUserId(userId)||[]
        const totalOrder=orders.length
        let addressString=""
        const totalSpent = orders.reduce((total,order)=>total+order.total,0)
        if (address) {
            addressString = `${address?.street}, ${address?.city}, Postal Code: ${address?.postalCode}.`
        }
        const userDetail={
            user,
            totalOrder,
            totalSpent,
            addressString
        }
        return res.status(200).json(userDetail)
    }
    catch(e){
        return res.status(500).json({
            message: "Internal server error"
        });   
    }
}
const HandlelockUser =async(req,res)=>{
    const userId = req.params.id
    const {status}= req.body
    try{
        const user = await userService.updateUserStatus(userId,status);
        return res.status(200).json({
            message:"Successful"
        })
    }
    catch(e){ 
        res.status(500).json({ message: 'Error deleting product' })
    }

};

const adminUserController = {
    getAllUsers,
    getUsersApi,
    HandlelockUser,
    getUserDetail
};
export default adminUserController;