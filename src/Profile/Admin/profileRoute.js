import express from "express";
import adminProfileController from "./profileController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
import multer from 'multer';
import fs from 'fs-extra';

const adminProfileRouter = express.Router();
adminProfileRouter.use(isUserLoginAndRedirect);
adminProfileRouter.use(isAdmin);

const uploadDir = 'src/uploads';
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

adminProfileRouter.put("/update", upload.single('avatar'), adminProfileController.updateProfile);
adminProfileRouter.get("/", adminProfileController.getAdminProfile);
adminProfileRouter.get("/changePassword", adminProfileController.getAdminChangePassword);
adminProfileRouter.post("/changePassword", adminProfileController.changePassword);

export default adminProfileRouter;