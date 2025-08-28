import express from "express";
import { addToCart, deleteCartItem, editCartItem, getAllCartItems, getSpecificCartItem } from "../../controllers/cartController.js";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { addToCartValidator, cartParamValidator, getCartItemValidtor } from "../../validators/cartValidator.js";
import { validate } from '../../middlewares/validate.js';


export const CartRouter = express.Router();

CartRouter.route('/')
    .get(verifyJWT,verifyRoles('User'), getCartItemValidtor, validate, getAllCartItems)
    .post(verifyJWT, verifyRoles('User'), addToCartValidator, validate ,addToCart)

CartRouter.route('/:productId')
    .get(verifyJWT, verifyRoles('User'), cartParamValidator, validate, getSpecificCartItem)
    .patch(verifyJWT, verifyRoles('User'), cartParamValidator, validate, editCartItem)
    .delete(verifyJWT, verifyRoles('User'), cartParamValidator, validate, deleteCartItem)