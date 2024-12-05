
import {getPaymentUrl,getCancelPage,getSuccessPage,webHookHandler}
from "./controller.js";
import express from "express";

const router = express.Router();

router.post("/pay", getPaymentUrl);
router.get("/cancel", getCancelPage);
router.get("/success", getSuccessPage);
router.post("/webhook", webHookHandler);

export default router;