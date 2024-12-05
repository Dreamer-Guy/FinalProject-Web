import { payForOrder,paySuccess,payCancel,getPaymentPage}
 from "./controller.js";
import express from "express";

const router = express.Router();

router.get("/",getPaymentPage);
router.post("/pay", payForOrder);
router.get("/success-pay", paySuccess);
router.get("/cancel", payCancel);

export default router;