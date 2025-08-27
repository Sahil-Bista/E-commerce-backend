import express from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { verifyRoles } from '../../middlewares/verifyRoles.js';
import { cancelOrder, createOrder, getAllOrders, getUserSpecificOngoingOrders, getUserSpecificOrderHistory } from '../../controllers/orderController.js';
export const OrderRouter  = express.Router();

OrderRouter.get('/',verifyJWT, verifyRoles("Admin"), getAllOrders);
OrderRouter.post('/:cartId',verifyJWT, verifyRoles('User'),createOrder)
OrderRouter.get('/trackOrder',verifyJWT, verifyRoles('User'),getUserSpecificOngoingOrders);
OrderRouter.get('/orderHistory',verifyJWT, verifyRoles('User'),getUserSpecificOrderHistory);
OrderRouter.patch('/:orderId',verifyJWT, verifyRoles('User'),cancelOrder)