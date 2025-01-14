import serviceFactory from "../../Factory/serviceFactory.js";
import { hashPassword, comparePlainAndHashed } from "../../utils/hashAndCompare.js";

const userService = serviceFactory.getUserService()

const getAdminProfile = async (req, res) => {
    try {
        const user = req.user || null;
        res.render('admin/Profile/profile', {
            user,
            xAxisCaseYear: JSON.stringify([]), 
            yAxisRevenueYear: JSON.stringify([])
        });
    } catch (error) {
        console.error('Error in getAdminProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getAdminChangePassword = async (req, res) => {
    try {
        const user = req.user || null;
        
        res.render('admin/Profile/changePassword', {
            user
        });
    } catch (error) {
        console.error('Error in getAdminProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userInfo = await userService.getUserById(user._id);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        
        const isValidPassword = await comparePlainAndHashed(currentPassword, userInfo.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }


        userInfo.password = await hashPassword(newPassword);
        await userService.saveUser(userInfo);

        return res.status(200).json({ 
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Error in changePassword:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

const adminProfileController = {
    getAdminProfile,
    getAdminChangePassword,
    changePassword
};
export default adminProfileController;
