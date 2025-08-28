import { param , query} from "express-validator";

export const createOrderValidation = [
    param('cartId')
        .notEmpty()
        .withMessage('Cart Id is required')
        .isMongoId()
        .withMessage('Cart Id must be a valid mongo object')
]

export const getOrderValidtor = [
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

export const cancelOrderValidator = [
    param('orderId')
        .notEmpty()
        .withMessage('Cart Id is required')
        .isMongoId()
        .withMessage('Cart Id must be a valid mongo object')
]