import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "../../controllers/productController.js";
import {verifyJWT} from '../../middlewares/verifyJWT.js';
import {verifyRoles} from '../../middlewares/verifyRoles.js';
export const ProductRouter = express.Router();


ProductRouter.route('/')
    .get(verifyJWT, getAllProducts)
    .post(verifyJWT, verifyRoles('Admin'),createProduct);

ProductRouter.route('/:productId')
    .get(verifyJWT,getSpecificProduct)
    .patch(verifyJWT, verifyRoles('Admin'),updateProduct)
    .delete(verifyJWT, verifyRoles('Admin'),deleteProduct)