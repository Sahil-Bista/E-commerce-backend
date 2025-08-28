import { param } from "express-validator";

export const paymentValidator = [
    param('orderId')
        .isEmpty()
        .withMessage('OrderId cannot be empty')
        .isMongoId()
        .withMessage('ordr Id mustbe a valid mongo id object')
]