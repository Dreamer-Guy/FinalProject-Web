
import express from "express";
import {getPaymentPage,getvnIPNBack,getSuccessPage}
from "./controller.js";

const router = express.Router();

router.get("/pay",getPaymentPage);
router.get("/success", getSuccessPage);
router.get("/ipn", getvnIPNBack);

export default router;