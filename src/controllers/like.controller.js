import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from '../models//tweet.model.js';

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new ApiError(400, "videoId is required");
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid videoId");

  const isValidId = await Video.findById(videoId);
  if (!isValidId) {
    throw new ApiError(404, "No video found to this ID");
  }

  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  console.log("this is video like", existingLike);

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Video unliked successfully"));
  } else {
    const newLike = await Like.create({ video: videoId, likedBy: userId });
    return res
      .status(201)
      .json(new ApiResponse(201, "Video liked successfully", newLike));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "commentId is required");
  const userId = req.user._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "Invalid commentId");

  const isValidId = await Comment.findById(commentId);
  if (!isValidId) {
    throw new ApiError(404, "No comment found to this ID");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment unliked successfully"));
  } else {
    const newLike = await Like.create({ comment: commentId, likedBy: userId });
    return res
      .status(201)
      .json(new ApiResponse(201, "Comment liked successfully", newLike));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) throw new ApiError(400, "tweetId is required");
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!mongoose.Types.ObjectId.isValid(tweetId))
    throw new ApiError(400, "Invalid tweetId");

 const isValidId = await Tweet.findById(tweetId);
 if (!isValidId) {
   throw new ApiError(404, "No tweet found to this ID");
 }

  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });
  console.log("this is existing user ", existingLike);

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet unliked successfully"));
  } else {
    const newLike = await Like.create({ tweet: tweetId, likedBy: userId });
    return res
      .status(201)
      .json(new ApiResponse(201, "Tweet liked successfully", newLike));
  }
});

const getLikesByVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new ApiError(400, "videoId is required");

  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid videoId");
  const likes = await Like.find({ video: videoId });
  console.log("this i s video", likes);

  if (!likes) {
    throw new ApiError(404, "No likes found for this video");
  }
  res.status(200).json(
    new ApiResponse(200, "Likes fetched successfully", {
      likes,
      totalLikes: likes.length,
    })
  );
});

const getLikesByComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "commentId is required");

  const likes = await Like.find({ comment: commentId });
  if (!likes) {
    throw new ApiError(404, "No likes found for this comment");
  }
  res.status(200).json(
    new ApiResponse(200, "Likes fetched successfully", {
      likes,
      totalLikes: likes.length,
    })
  );
});

const getLikesByTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) throw new ApiError(400, "tweetId is required");

  const likes = await Like.find({ tweet: tweetId });
  if (!likes) {
    throw new ApiError(404, "No likes found for this tweet");
  }
  res.status(200).json(
    new ApiResponse(200, "Likes fetched successfully", {
      likes,
      totalLikes: likes.length,
    })
  );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikesByVideo,
  getLikesByComment,
  getLikesByTweet,
};
