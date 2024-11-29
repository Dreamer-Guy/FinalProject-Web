import express from 'express';
import { editAddress, updateAddress } from './controller.js';

const addressRouter = express.Router();

addressRouter.get('/get', editAddress);
addressRouter.put('/:id', updateAddress);

export default addressRouter;

