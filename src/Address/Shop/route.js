import express from 'express';
import shopAddressController from './controller.js';

import isUserLoginAndRedirect from '../../middleWare/Authentication/isUserLoginAndRedirect.js';

const addressRouter = express.Router();
addressRouter.use(isUserLoginAndRedirect);

addressRouter.get('/get', shopAddressController.getEditAddressPage);
addressRouter.put('/:id', shopAddressController.updateAddress);

export default addressRouter;

