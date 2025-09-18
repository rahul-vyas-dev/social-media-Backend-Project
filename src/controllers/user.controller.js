import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { UploadFile, DeleteFile } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
// import FileSystem from "fs";

const generateAccessTokenandRefreshToken = async (user) => {
  const accessToken = await user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();

  // user.refreshToken = refreshToken;
  // await user.save();
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response to frontend

  console.log("req.body:", req.body);

  //got user details from frontend
  const { password, username, fullName, email } = req.body;
  console.log(
    "password, username, fullName, email:",
    password,
    username,
    fullName,
    email
  );

  if (!password || !username || !fullName || !email)
    throw new ApiError(400, "All fields are required");

  //validation - not empty
  if (
    [password, username, fullName, email].some((field) => field?.trim() === "")
  )
    throw new ApiError(400, "All fields are required");

  //check if user already exists: username, email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new ApiError(409, "User already exists");

  //check for images, check for avatar
  const avatar = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  // console.log('this is public path',avatar,coverImageLocalPath);

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  //uncomment this to get the cover image mandatory
  // else throw new ApiError(400, "Cover image is required");

  if (!avatar) throw new ApiError(400, "Avatar is required");

  //upload them to cloudinary, avatar
  const avatarPublicId = await UploadFile(avatar);
  const coverImagePublicId = await UploadFile(coverImageLocalPath);
  // console.log('avatarPublicId, coverImagePublicId:', avatarPublicId, coverImagePublicId);

  // if upload fails
  if (!avatarPublicId) throw new ApiError(500, "Avatar upload failed");
  if (coverImageLocalPath && !coverImagePublicId)
    throw new ApiError(500, "Cover image upload failed");

  //create user object - create entry in db
  const user = await User.create({
    password,
    username,
    fullName,
    email,
    avatar: avatarPublicId.url,
    coverImage: coverImagePublicId?.url || null,
    CoverImagePublicId: coverImagePublicId?.public_id || null,
    AvatarPublicId: avatarPublicId?.public_id || null,
  });

  //check for user creation
  if (!user) throw new ApiError(500, "User creation failed");

  //remove password and refresh token field from response
  const userObj = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // FileSystem.unlinkSync(avatar);
  // if (coverImageLocalPath) FileSystem.unlinkSync(coverImageLocalPath);

  //return response to frontend
  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", userObj));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user exists: username, email
  // compare password
  // remove password and refresh token field from response
  // check for user creation
  // return response to frontend

  console.log("this is the login req ", req.body);

  const { username, password, email } = req.body;

  if ((!username && !email) || !password)
    throw new ApiError(400, "All fields are required");

  //check if user exists: username, email
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(404, "User not found");

  //compare password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  //remove password and refresh token field from response
  const userObj = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!userObj) throw new ApiError(500, "Something went wrong");

  const tokens = await generateAccessTokenandRefreshToken(userObj);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: "Strict",
  };
  //return response to frontend

  res
    .status(200)
    .cookie("refreshToken", tokens.refreshToken, options)
    .cookie("accessToken", tokens.accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: userObj,
        ...tokens,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //get user from req.user
  //if no user, throw error
  //remove refresh token from db
  //remove cookies
  //return response

  console.log(
    "this is the logout req ",
    req.body,
    "this is user",
    req.user,
    req.cookies
  );
  const user = req.user;
  if (!user) throw new ApiError(401, "Not authorized");

  await User.findByIdAndUpdate(
    user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  ).exec();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: "Strict",
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out successfully", null));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //get refresh token from cookies
  //validate refresh token
  //if not valid, throw error
  //if valid, generate new access token and refresh token
  //save refresh token in db
  //set cookies
  //return response

  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) throw new ApiError(401, "No refresh token provided");

    //validate refresh token
    const decodedInfo = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedInfo || !decodedInfo._id)
      throw new ApiError(401, "Invalid refresh token");

    const user = await User.findById(decodedInfo?._id);
    if (!user) throw new ApiError(404, "User not found");

    const tokens = await generateAccessTokenandRefreshToken(user);
    if (!tokens) throw new ApiError(500, "Could not generate tokens");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "Strict",
    };

    res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, options)
      .cookie("accessToken", tokens.accessToken, options)
      .json(
        new ApiResponse(200, "Access token refreshed successfully", {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Refresh token expired");
    }
    new ApiError(500, "Could not refresh access token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // get user from req.user
  // get old password and new password from req.body
  // validate old password and new password
  // check if old password is correct
  // if correct, update password
  // if not, throw error
  // return response

  console.log("this is change password reg ", req.body);

  const user = req.user;
  if (!user) throw new ApiError(401, "Not authorized");

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new ApiError(400, "All fields are required");
  if (oldPassword === newPassword)
    throw new ApiError(400, "New password must be different from old password");

  // console.log('this is user before change password ', user);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(401, "Old password is incorrect");
  // console.log('this is user after password match ', isPasswordValid);

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", null));
});

const getCurrentUserDetails = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", req.user));
});

const updateCurrentUserDetails = asyncHandler(async (req, res) => {
  // get user from req.user
  // get user details from req.body
  // validate user details
  // update user details
  // return response

  const { email, fullName } = req.body;
  if (!email || !fullName) throw new ApiError(400, "All fields are required");

  const user = req.user;
  if (!user) throw new ApiError(401, "Not authorized");

  if (email === user.email && fullName === user.fullName)
    throw new ApiError(400, "No changes made");

  user.email = email;
  user.fullName = fullName;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, "User details updated successfully", user));
});

const updateCurrentUserAvatar = asyncHandler(async (req, res) => {
  // get user from req.user
  // get images from req.files
  // validate images
  // upload images to cloudinary
  // update user images
  // return response
  try {
    const user = req.user;
    if (!user) throw new ApiError(401, "Not authorized");

    const avatar = req.file?.path;
    if (!avatar) throw new ApiError(400, "Avatar is required");

    const url = await UploadFile(avatar);
    if (!url) throw new ApiError(500, "Could not upload avatar");

    //delete previous avatar from cloudinary
    if (user?.AvatarPublicId) await DeleteFile(user?.AvatarPublicId);

    //update user avatar
    user.avatar = url.url;
    user.AvatarPublicId = url.public_id;
    await user.save();
    res
      .status(200)
      .json(new ApiResponse(200, "User avatar updated successfully", user));
  } catch (error) {
    new ApiError(500, "Could not update avatar");
  }
});

const updateCurrentUserCoverImage = asyncHandler(async (req, res) => {
  // get user from req.user
  // get images from req.files
  // validate images
  // upload images to cloudinary
  // update user images
  // return response

  try {
    const user = req.user;
    if (!user) throw new ApiError(401, "Not authorized");

    const coverImage = req.file?.path;
    if (!coverImage) throw new ApiError(400, "coverImage is required");

    const url = await UploadFile(coverImage);
    if (!url) throw new ApiError(500, "Could not upload coverImage");

    //delete previous avatar from cloudinary
    if (user?.CoverImagePublicId) await DeleteFile(user?.CoverImagePublicId);

    //update user coverImage
    user.CoverImagePublicId = url.public_id;
    user.coverImage = url.url;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, "User coverImage updated successfully", user));
  } catch (error) {
    new ApiError(500, "Could not update cover image");
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // get userId from req.params
  // validate userId
  // get user details from db
  // if user not found, throw error
  // return response

  const { username } = req.params;
  if (!username.trim()) throw new ApiError(400, "UserId is required");
  username.trim();
  username.toLowerCase();
  console.log("this is the username", username);
  
  const channel = await User.aggregate([
    {
      $match: { username:username},
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  console.log("this is the channel ", channel);
  if (!channel.length) throw new ApiError(404, "Channel not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Channel fetched successfully", channel[0]));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // get user from req.user
  // get watch history from user
  // return response
  console.log('this is the user in watch history', req.user._id);

  const watchHistory = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchlist",
        foreignField: "_id",
        as: "watchlist",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
    // {
    //   $project: {
    //     watchlist: 1, _id: 1,
    //     username: 1,
    //     fullName:1
    //    }
    // }
  ]);

  console.log('this is the watch history', watchHistory[0]?.watchlist,watchHistory);
  
  res.status(200).json(
    new ApiResponse(200, "Watch history fetched successfully", {
      watchHistory: watchHistory[0]?.watchlist || [],
    })
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUserDetails,
  updateCurrentUserDetails,
  updateCurrentUserAvatar,
  updateCurrentUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
