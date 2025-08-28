//const {name ,description,price, stock ,category} = req.body;

import { body } from "express-validator";

export const createProductValidation = [
    body('name')
    .notEmpty()
    .withMessage('')
]