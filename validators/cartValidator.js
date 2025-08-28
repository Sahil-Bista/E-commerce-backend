import { body , query, param} from "express-validator";

export const addToCartValidator = [
    body('productId')
        .trim()
        .isEmpty()
        .withMessage('Product Id is required')
        .isMongoId()
        .withMessage('Product Id must be a valid mongoId'),

    body('quantity')
        .trim()
        .isInt({gt : 0})
        .withMessage('Quantity must be greater than 0')
        .toInt()
]

export const getCartItemValidtor = [
    query('page')
        .trim()
        .optional()
        .isInt({gt : 0})
        .withMessage('Page number must be greater than 0')
        .toInt(),
    
    query('limit')
        .trim()
        .optional()
        .isInt({git : 0})
        .withMessage('Limit  must be greater than 0')
        .toInt()
]

export const cartParamValidator = [
    param('productId')
        .notEmpty()
        .withMessage('Product Id is required')
        .isMongoId()
        .withMessage('product Id must be a valid mongo id object'),
]
