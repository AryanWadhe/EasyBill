import jwt from "jsonwebtoken";
import Business from "../models/business.model.js";
import ApiError from "../libs/ApiError.js";
export const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(new ApiError("Unauthorized"));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json(new ApiError("Unauthorized"));
    }
    const business = await Business.findById(decodedToken.id).select(
      "-password"
    );
    if (!business) {
      return res.status(401).json(new ApiError("Unauthorized"));
    }
    res.locals.business = business;
    next();
  } catch (error) {
    res.status(500).json(new ApiError("Internal Server Error"));
  }
};
