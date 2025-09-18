import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = async (req, _, next) => {
  try {
    // console.log(
    //   "this is the auth middleware req ",
    //   req.body,
    //   req.cookies,
    //   req.headers
    // );

    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");
    // console.log("this is the token ", token);
    if (!token) {
      throw new ApiError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("this is the decoded token ", decoded);

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, token failed");
  }
};

export { verifyToken };
