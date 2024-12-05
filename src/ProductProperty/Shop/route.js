import {getProductDetailsPageByID}
from "./controller.js";

import express from "express";

const router = express.Router();

router.get("/get/:id", getProductDetailsPageByID);

export default router;