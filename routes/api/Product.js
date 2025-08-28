import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "../../controllers/productController.js";
import {verifyJWT} from '../../middlewares/verifyJWT.js';
import {verifyRoles} from '../../middlewares/verifyRoles.js';
import parser from "../../middlewares/imageUpload.js";
import { createProductValidation, productParamValidator, updateProductValidation } from "../../validators/productValidator.js";
import { validate } from "../../middlewares/validate.js";

export const ProductRouter = express.Router();

ProductRouter.route('/')
    .get(verifyJWT, getAllProducts)
    .post(verifyJWT, verifyRoles('Admin'), createProductValidation, validate, parser.array("images", 5), createProduct);

ProductRouter.route('/:productId')
    .get(verifyJWT,productParamValidator, validate, getSpecificProduct)
    .patch(verifyJWT, verifyRoles('Admin'), updateProductValidation, validate, parser.array("images", 5),updateProduct)
    .delete(verifyJWT, verifyRoles('Admin'), productParamValidator, validate, deleteProduct);