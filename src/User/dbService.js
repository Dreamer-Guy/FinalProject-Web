import mongoose, { mongo } from "mongoose";
import User from "../Model/User.js";
const userService={
    getUserById: async (id) => {
        const user=await User.findById(id);
        return user;
    },
    getUserByEmailOrUsername: async (emailOrUsername) => {
        const user=await User.findOne({$or:[{email:emailOrUsername},{userName:emailOrUsername}]});
        return user;
    },
    getUserByUserName:async(userName)=> {
        const user=await User.findOne({userName:userName});
        return user;
    },
    getUserByEmail:async(email)=> {
        const user=await User.findOne({email:email});
        return user;
    },
    isUserExistByUserName: async (userName) => {
        const user=await User.findOne({userName:userName});
        return user?true:false;
    },
    isUserExistByEmail: async (email) => {
        const user=await User.findOne({email:email});
        return user?true:false;
    },
    createUser: async (user) => {
        const newUser=new User(user);
        return newUser;
    },
    saveUser: async (user) => {
        await user.save();
        return user;
    },
    updateUser: (id,user)=>{
        return User.updateOne({_id:id},user)
    },
    getAllUsers: async () => {
        const users=await User.find().lean();
        return users;
    },
    getTopUsers:async(limit)=>{
        const users=await User.find().sort({totalOrder:-1}).limit(limit).lean();
        return users;
    },
    getUsersApi:async(searchQuery,sortOptions,page=1,rowPerPage=10,currentUserId)=>{
        try{
           let query=User.find({_id:{$ne:currentUserId}})
           if(searchQuery){
            query=query.or([
                {fullName:{$regex:searchQuery,$options:'i'}},
                {email:{$regex:searchQuery,$options:'i'}}
            ])
           }
           if(sortOptions){
            query=query.sort(sortOptions)
           }
           const totalUsers = await User.countDocuments(query.getQuery())
           const users=await query.skip((page-1)*rowPerPage).limit(rowPerPage).lean()
           return {users,
            totalUsers,
            currentPage:page,
            totalPages:Math.ceil(totalUsers/rowPerPage)
        }
        }catch(error){
            console.error("Error in getUsersApi:", error);
            return {success:false,message:error.message}
        }
    },
    updateUserStatus:async(id,status)=>{
        return User.updateOne({_id:id},{ $set: { status: status } })
    }
}

export default userService;