import express from 'express';
import { registerUser } from '../../controllers/registerController.js';
import { userlogin } from '../../controllers/authController.js';
import { refreshTokenController } from '../../controllers/refreshTokenController.js';
import { logOut } from '../../controllers/logOutController.js';
export const userRouter = express.Router();

userRouter.post('/register', registerUser );
userRouter.post('/login', userlogin );
userRouter.get('/',refreshTokenController);
userRouter.post('/logout', logOut);



