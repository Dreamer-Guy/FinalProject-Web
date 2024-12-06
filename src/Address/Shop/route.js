import express from 'express';
import { getEditAddressPage, updateAddress } from './controller.js';

const addressRouter = express.Router();

addressRouter.get('/get', getEditAddressPage);
addressRouter.put('/:id', updateAddress);

export default addressRouter;

