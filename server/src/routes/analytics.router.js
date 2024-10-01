import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";

const analyticsRouter = Router();

analyticsRouter.get("/", checkToken, getAnalytics);

export default analyticsRouter;
