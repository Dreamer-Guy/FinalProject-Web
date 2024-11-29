import { get } from "mongoose";

const mockUsers = [
    {
        _id: "64f2cabb1d1b2e0012a3f000",
        fullName: "John Doe",
        userName: "john",
        email: "johndoe@example.com",
        password: "$2a$12$SwIFvhqeekJsMJwC/WTBtOSt5T8NZ31vbdoUSC9kfk5fvuD6borlW",
        role: "user"
    },
    {
        _id: "64f2cabb1d1b2e0012a3f001",
        fullName: "Jane Smith",
        userName: "janesmith456",
        email: "janesmith@example.com",
        password: "password456",
        role: "user"
    },
    {
        _id: "64f2cabb1d1b2e0012a3f002",
        fullName: "Alice Johnson",
        userName: "alicejohnson789",
        email: "alicejohnson@example.com",
        password: "password789",
        role: "admin"
    },
    {
        _id: "64f2cabb1d1b2e0012a3f003",
        fullName: "Bob Brown",
        userName: "bobbrown321",
        email: "bobbrown@example.com",
        password: "password321",
        role: "user"
    },
    {
        _id: "64f2cabb1d1b2e0012a3f004",
        fullName: "Charlie White",
        userName: "charliewhite654",
        email: "charliewhite@example.com",
        password: "password654",
        role: "user"
    }
];



const userService={
    getUserById: async (id) => {
        return mockUsers.find(user => user._id === id);
    },
    getUserByEmailOrUsername: async (emailOrUsername) => {
        return mockUsers.find(user => user.email === emailOrUsername || user.userName === emailOrUsername);
    },
    createUser: async (user) => {
        return user;
    },
    saveUser: async (user) => {
        mockUsers.push(user);
        return user;
    },
}

export default userService;