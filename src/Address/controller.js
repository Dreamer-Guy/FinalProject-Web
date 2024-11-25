import Address from "../Model/Address.js"
import serviceFactory from "../Factory/serviceFactory.js";


const addressService=serviceFactory.getAddressService();
const userService=serviceFactory.getUserService();


const isAddressChanged = (oldAddress, newAddress) => {
    return oldAddress.street !== newAddress.street ||
           oldAddress.city !== newAddress.city ||
           oldAddress.postalCode !== newAddress.postalCode ||
           oldAddress.phone !== newAddress.phone ||
           oldAddress.notes !== newAddress.notes;
}

const editAddress = async (req, res) => {
    try{
        const userId = req.user._id;
        const address = await addressService.getAddressByUserId(userId);
        
        res.render('manageAddress', {
            address: address || {}, 
            user: req.user,
            error: null,
            message: ""
        });  
    } catch (err) {
        console.log(err);
        
        res.render('manageAddress', {
            address: {},
            user: req.user,
            error: err,
            message: `Error: ${err.message}`
        });
    }
}

const updateAddress = async (req, res) => {
    try{
        const userId = req.user._id;
        const { street, city, postalCode, phone, notes } = req.body;
        
        const address = await addressService.getAddressByUserId(userId);
        let message = "";
        
        if(address){
            
            const newAddress = {street, city, postalCode, phone, notes};
            let isChanged = isAddressChanged(address, newAddress);
            
            if(isChanged){
                address.street = street;
                address.city = city;
                address.postalCode = postalCode;
                address.phone = phone;
                address.notes = notes;
                await addressService.updateAddress(userId, address);
                message = "Address updated successfully.";
            }  
        } else {
            const newAddress = new Address({
                userId: userId,
                street: street,
                city: city,
                postalCode: postalCode,
                phone: phone,
                notes: notes
            });
            await addressService.saveAddress(newAddress);
            message = "Address added successfully.";
        }   
        
        res.render("manageAddress",{
            address: address || {}, 
            user: req.user,
            error: null,
            message: message || ""
        });
    } catch (err) {
        console.log(err);
        
        res.render("manageAddress",{
            address: {},
            user: req.user,
            error: err,
            message: `Error: ${err.message}`
        });
    }
}


export {editAddress,updateAddress}
