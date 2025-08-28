import express from 'express';
import { registerUser } from '../../controllers/registerController.js';
import { userlogin } from '../../controllers/authController.js';
import { refreshTokenController } from '../../controllers/refreshTokenController.js';
import { logOut } from '../../controllers/logOutController.js';
import { loginValidator, registerValidator } from '../../validators/userValidator.js';
import { validate } from '../../middlewares/validate.js';
export const userRouter = express.Router();

userRouter.post('/register', registerValidator, validate, registerUser );
userRouter.post('/login', loginValidator, validate, userlogin );
userRouter.get('/',refreshTokenController);
userRouter.post('/logout', logOut);



