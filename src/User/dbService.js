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
    isUserExistByUserName: async (userName) => {
        const user=await User.findOne({userName:userName});
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
}

export default userService;