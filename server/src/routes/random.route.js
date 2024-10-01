import { Router } from "express";
import { getRandomData } from "../controllers/randomData.controller.js";

const randomDataRouter = Router();

randomDataRouter.post("/random", getRandomData);

export default randomDataRouter;
