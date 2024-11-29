import { getDashBoardPage } 
from "./dashboardController.js";
import express from "express";

const adminDashBoardRouter = express.Router();

adminDashBoardRouter.get("/", getDashBoardPage);

export default adminDashBoardRouter;