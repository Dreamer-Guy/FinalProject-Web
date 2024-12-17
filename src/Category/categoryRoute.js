import express from "express";
import { getCategoryProperties } from "./categoryController.js";

const adminCategoryRouter = express.Router();

adminCategoryRouter.get("/:categoryId/properties", getCategoryProperties);

export default adminCategoryRouter;
