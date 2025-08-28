import {body} from "express-validator";

export const registerValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please provide a valid email address"),,

    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name is required"),
    
    body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name is required"),
    
    body("phoneNumber")
        .trim()
        .matches(/^[0-9]{10}$/) 
        .withMessage("Phone number must contain only digits and be 10 digits long"),
    
    body("roles")
        .optional()
        .isArray()
        .withMessage("Roles must be an array")
        .custom((roles)=>{
            const validRoles = ['User','Vendor','Admin'];
            for (const role of roles){
                if(!validRoles.includes(role)){
                    throw newError(`Invalid role: ${role}`);
                }
            }
            return true;
        })
]

export const loginValidator = [
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .trim()
        .isLength({min:6})
        .withMessage('Password must be at least 6 characters long')
]