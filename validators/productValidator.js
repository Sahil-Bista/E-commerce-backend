//const {name ,description,price, stock ,category} = req.body;

import { body, param, query } from "express-validator";

export const createProductValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please enter a valid product name'),
    
    body('description')
        .trim()
        .escape()
        .notEmpty()
        .isLength({min : 20})
        .withMessage('The product description should at least be of 20 words'),
    
    body('price')
        .trim()
        //this works fine wth string, so if .toFLoat() is kept first "10abc" might sneak in
        .isFloat({gt : 0})
        .withMessage("price must be a number greater than 0")
        .toFloat(),
    
    body('stock')
        .trim()
        //this works fine wth string, so if .toFLoat() is kept first "10abc" might sneak in
        .isInt({min : 0})
        .withMessage("Stock must be a positve number")
        .toInt(),
    
    body('category')
        .isEmpty()
        .withMessage('Category cannot be empty')
        .custom((category)=>{
            const validCategory = ['Sneakers','Casual']
            if(!validCategory.includes(category)){
                throw newError(`Invalid category : ${category}`);
            }
            return true;
        }),
    
    //gives access to the wole req object
    body().custom((_, { req }) => {
        if (!req.files || req.files.length === 0) {
            throw new Error("At least one product image is required");
        }
        return true;
    })
]

export const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please enter a valid product name'),
    
    body('description')
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .isLength({min : 20})
        .withMessage('The product description should at least be of 20 words'),
    
    body('price')
        .optional()
        .trim()
        //this works fine wth string, so if .toFLoat() is kept first "10abc" might sneak in
        .isFloat({gt : 0})
        .withMessage("price must be a number greater than 0")
        .toFloat(),
    
    body('stock')
        .optional()
        .trim()
        //this works fine wth string, so if .toFLoat() is kept first "10abc" might sneak in
        .isInt({min : 0})
        .withMessage("Stock must be a positve number")
        .toInt(),
    
    body('category')
        .optional()
        .isEmpty()
        .withMessage('Category cannot be empty')
        .custom((category)=>{
            const validCategory = ['Sneakers','Casual']
            if(!validCategory.includes(category)){
                throw newError(`Invalid category : ${category}`);
            }
            return true;
        })
]

export const productParamValidator = [
    param('productId')
        .notEmpty()
        .withMessage('Product Id is required')
        .isMongoId()
        .withMessage('product Id must be a valid mongo id object'),
]

export const getProductValidtor = [
    query('page')
        .optional()
        .trim()
        .isInt({gt : 0})
        .withMessage('Page number must be greater than 0')
        .toInt(),
    
    query('limit')
        .optional()
        .trim()
        .isInt({git : 0})
        .withMessage('Limit  must be greater than 0')
        .toInt()
]