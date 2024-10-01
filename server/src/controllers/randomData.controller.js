import ApiError from "../libs/ApiError.js";
import {  fakerEN_IN as faker } from "@faker-js/faker";
import ApiResponse from "../libs/ApiResponse.js";
import getNestedProperty from "../utils/getNestedProperty.js";
export const getRandomData = async (req, res) => {
  const { fields, count = 1 } = req.body;
  if (!fields || !Array.isArray(fields)) {
    return res.status(400).json(new ApiError("Invalid fields"));
  }
  try {
    
    const result = Array.from({ length: count }, () => {
      const data = {};
      fields.forEach((field) => {
        const fakerFn = getNestedProperty(faker, field);
        if (typeof fakerFn === "function") {
          data[field] = fakerFn();
        } else {
          data[field] = null;
        }
      });
      return data;
    });
    return res
      .status(200)
      .json(new ApiResponse("Data fetched successfully", result));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(error.message || "Something went wrong"));
  }
};
