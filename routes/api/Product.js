import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "../../controllers/productController.js";
import {verifyJWT} from '../../middlewares/verifyJWT.js';
import {verifyRoles} from '../../middlewares/verifyRoles.js';
import parser from "../../middlewares/imageUpload.js";

export const ProductRouter = express.Router();

ProductRouter.route('/')
    .get(verifyJWT, getAllProducts)
    .post(verifyJWT, verifyRoles('Admin'), parser.array("images", 5), createProduct);

ProductRouter.route('/:productId')
    .get(verifyJWT,getSpecificProduct)
    .patch(verifyJWT, verifyRoles('Admin'),updateProduct)
    .delete(verifyJWT, verifyRoles('Admin'),deleteProduct)