import Address from "../../Model/Address.js"
import serviceFactory from "../../Factory/serviceFactory.js";


const addressService=serviceFactory.getAddressService();
const cartService=serviceFactory.getCartService();


const isAddressChanged = (oldAddress, newAddress) => {
    return oldAddress.street !== newAddress.street ||
           oldAddress.city !== newAddress.city ||
           oldAddress.postalCode !== newAddress.postalCode ||
           oldAddress.phone !== newAddress.phone ||
           oldAddress.notes !== newAddress.notes;
}

const getEditAddressPage = async (req, res) => {
    try{
        const userId = req.user._id;
        const address = await addressService.getAddressByUserId(userId);
        const productsInCart = await cartService.coutProductInCart(userId);
        
        res.render('manageAddress', {
            address: address || {}, 
            user: req.user,
            error: null,
            message: "",
            cartNumber: productsInCart
        });  
    } catch (err) {
        console.log(err);
        
        res.render('manageAddress', {
            address: {},
            user: req.user,
            error: err,
            message: `Error: ${err.message}`,
            cartNumber: 0
        });
    }
}

const updateAddress = async (req, res) => {
    try{
        const userId = req.user._id;
        const productsInCart = await cartService.coutProductInCart(userId);
        const { street, city, postalCode, phone, notes } = req.body;
        
        let address = await addressService.getAddressByUserId(userId);
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
            address = newAddress;
        }   
        
        res.render("manageAddress",{
            address: address || {}, 
            user: req.user,
            error: null,
            message: message || "",
            cartNumber: productsInCart
        });
    } catch (err) {
        console.log(err);
        
        res.render("manageAddress",{
            address: {},
            user: req.user,
            error: err,
            message: `Error: ${err.message}`,
            cartNumber: 0
        });
    }
}

const shopAddressController = {
    getEditAddressPage,
    updateAddress
};

export default shopAddressController;
