import ApiError from "../libs/ApiError.js";
import ApiResponse from "../libs/ApiResponse.js";
import Business from "../models/business.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = async (business) => {
  const token = jwt.sign({ id: business._id }, process.env.JWT_SECRET);
  return token;
};

export const register = async (req, res) => {
  try {
    const data = req.body;
    const doesBusinessExist = await Business.findOne({ email: data.email });
    if (doesBusinessExist) {
      return res.status(400).json(new ApiError("Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await Business.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      taxId: data.taxId,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    });
    res.status(201).json(new ApiResponse("Business created successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Internal Server Error"));
  }
};

export const login = async (req, res) => {
  try {
    const data = req.body;
    const business = await Business.findOne({ email: data.email });
    if (!business) {
      return res.status(400).json(new ApiError("Account not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      business.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json(new ApiError("Invalid password"));
    }
    const accessToken = await generateToken(business);
    res
      .status(200)
      .json(new ApiResponse("Login successful", {accessToken}));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Internal Server Error"));
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.status(200).json(new ApiResponse("Logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal Server Error"));
  }
};

export const getMe = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse("Fetched successfully", res.locals.business));
  } catch (error) {
    res.status(500).json(new ApiError("Internal Server Error"));
  }
};
