import express from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { verifyRoles } from '../../middlewares/verifyRoles.js';
import { cancelOrder, createOrder, getAllOrders, getUserSpecificOngoingOrders, getUserSpecificOrderHistory } from '../../controllers/orderController.js';
import {validate} from "../../middlewares/validate.js"; 
import { cancelOrderValidator, createOrderValidation, getOrderValidtor } from '../../validators/orderValidator.js';
export const OrderRouter  = express.Router();

OrderRouter.get('/',verifyJWT, verifyRoles("Admin"), getOrderValidtor,validate , getAllOrders);
OrderRouter.post('/:cartId',verifyJWT, verifyRoles('User'), createOrderValidation, validate, createOrder);
OrderRouter.get('/trackOrder',verifyJWT, verifyRoles('User'),getUserSpecificOngoingOrders);
OrderRouter.get('/orderHistory',verifyJWT, verifyRoles('User'),getUserSpecificOrderHistory);
OrderRouter.delete('/:orderId',verifyJWT, verifyRoles('User'), cancelOrderValidator, validate, cancelOrder);