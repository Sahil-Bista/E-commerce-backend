import express from "express";
import { addToCart, deleteCartItem, editCartItem, getAllCartItems, getSpecificCartItem } from "../../controllers/cartController.js";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";

export const CartRouter = express.Router();

CartRouter.route('/')
    .get(verifyJWT,verifyRoles('User'), getAllCartItems)
    .post(verifyJWT, verifyRoles('User'), addToCart)

CartRouter.route('/:productId')
    .get(verifyJWT, verifyRoles('User'), getSpecificCartItem)
    .patch(verifyJWT, verifyRoles('User'), editCartItem)
    .delete(verifyJWT, verifyRoles('User'), deleteCartItem)