import { ZodError } from "zod";
import ApiError from "../libs/ApiError.js";

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log(error)
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
        }));
        return res
          .status(400)
          .json(new ApiError("Invalid Data", errorMessages));
      } else {
        console.log(error)
        res.status(500).json(new ApiError("Internal Server Error"));
      }
    }
  };
};

export const validateParams= (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
        }));
        return res
          .status(400)
          .json(new ApiError("Invalid Data", errorMessages));
      } else {
        console.log(error)
        res.status(500).json(new ApiError("Internal Server Error"));
      }
    }
  };
};
