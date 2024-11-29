import express from "express";
const homeRouter=express.Router();
import { getHomePage } from "./controller.js";
homeRouter.get("/",getHomePage);

export default homeRouter;