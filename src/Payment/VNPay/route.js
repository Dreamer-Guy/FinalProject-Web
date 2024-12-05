
import express from "express";
import {getPaymentUrl,getvnIPNBack,getSuccessPage}
from "./controller.js";

const router = express.Router();

router.post("/pay",getPaymentUrl);
router.get("/success", getSuccessPage);
router.get("/ipn", getvnIPNBack);

export default router;