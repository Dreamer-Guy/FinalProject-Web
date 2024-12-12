
import {getPaymentUrl,getCancelPage,getSuccessPage,webHookHandler}
from "./controller.js";
import express from "express";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";

const router = express.Router();

router.post("/pay", isUserLoginAndRedirect,getPaymentUrl);
router.get("/cancel", isUserLoginAndRedirect,getCancelPage);
router.get("/success", isUserLoginAndRedirect,getSuccessPage);
router.post("/webhook", webHookHandler);

export default router;