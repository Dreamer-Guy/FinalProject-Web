import express from 'express';
import { getEditAddressPage, updateAddress } from './controller.js';

import isUserLoginAndRedirect from '../../middleWare/Authentication/isUserLoginAndRedirect.js';

const addressRouter = express.Router();
addressRouter.use(isUserLoginAndRedirect);

addressRouter.get('/get', getEditAddressPage);
addressRouter.put('/:id', updateAddress);

export default addressRouter;

