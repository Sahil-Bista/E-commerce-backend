import express from "express";
import { handleWebHook, paymentCheckout } from "../../controllers/paymentController.js";
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { verifyRoles } from '../../middlewares/verifyRoles.js';
import { paymentValidator } from "../../validators/paymentValidator.js";
import {validate} from '../../middlewares/validate.js'
export const PaymentRouter = express.Router();

PaymentRouter.post('/create-checkout-session/:orderId',verifyJWT, verifyRoles('User'),express.json(), paymentValidator, validate ,paymentCheckout);
PaymentRouter.post('/webhook',verifyJWT, verifyRoles('User'), express.raw({ type: "application/json" }), handleWebHook);