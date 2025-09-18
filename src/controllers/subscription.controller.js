import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

// Subscribe to a channel
const subscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });
  if (existingSubscription) {
    throw new ApiError(400, "Already subscribed to this channel");
  }
  const subscription = new Subscription({
    subscriber: subscriberId,
    channel: channelId,
  });
  await subscription.save();
  res
    .status(201)
    .json(new ApiResponse(201, "Subscribed successfully", {subscription,length:subscription.length()}));
});

// Unsubscribe from a channel
const unsubscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscription = await Subscription.findOneAndDelete({
    subscriber: subscriberId,
    channel: channelId,
  });
  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }
  res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
});
// Get all subscriptions for a user
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "username email avatar");
  res
    .status(200)
    .json(
      new ApiResponse(200, "Subscriptions fetched successfully", subscriptions)
    );
});

// Get all subscribers for a channel
const getSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username email avatar"
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "Subscribers fetched successfully", subscribers)
    );
});

export { subscribe, unsubscribe, getSubscriptions, getSubscribers };