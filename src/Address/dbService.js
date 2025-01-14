import { create } from "migrate-mongo";
import Address from "../Model/Address.js";

const addressService={
    getAddressByUserId: async (id) => {
        return Address.findOne({userId:id}).lean();
    },
    updateAddress: async (id, address) => {
        return Address.updateOne({userId:id},address);
    },
    saveAddress: async(address)=>{
        await address.save();
        return address;
    },
    getAllAddresses: async () => {
        return Address.find().lean();
    },
    createAddress: async (address) => {
        return new Address(address);
    },
};


export default addressService;