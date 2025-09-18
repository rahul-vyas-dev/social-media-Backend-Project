import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const createComment = asyncHandler(async (req, res) => {
  const content = req.body?.content;
  const videoId = req.params?.videoId;
  if (!content || !videoId) {
    throw new ApiError(400, "Content and videoId are required");
  }
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid videoId");

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "Invalid commentId");
  const userId = req.user._id;
  if (!userId)
    throw new ApiError(401, "Unauthorized or Token has been expired");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const validUser = comment.validateUser(userId);
  if (!validUser)
    throw new ApiError(403, "You are not allowed to delete this comment");

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully", deletedComment));
});

const getCommentsByVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid videoId");
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: { path: "owner", select: "username avatar" },
  };
  const result = await Comment.aggregatePaginate(
    [
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      {
        $addFields: {
          areYouOwner: {
            $eq: ["$owner",new mongoose.Types.ObjectId(req.user._id)],
          },
        },
      },
    ],
    options
  );
  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", result));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const content = req.body?.content;
  // console.log('this iscontent ',content,commentId);

  if (!content) throw new ApiError(400, "Content is required");
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "Invalid commentId");

  const userId = req.user._id;
  if (!userId)
    throw new ApiError(401, "Unauthorized or Token has been expired");
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  const validUser = comment.validateUser(userId);
  if (!validUser)
    throw new ApiError(403, "You are not allowed to update this comment");
  comment.content = content;
  await comment.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully", comment));
});

export { createComment, deleteComment, getCommentsByVideo, updateComment };
