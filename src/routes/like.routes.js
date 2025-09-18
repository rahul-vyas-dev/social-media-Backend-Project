import { Router } from "express";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikesByVideo,
  getLikesByComment,
  getLikesByTweet,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/comment/:commentId", verifyToken, toggleCommentLike);
router.post("/tweet/:tweetId", verifyToken, toggleTweetLike);
router.post("/video/:videoId", verifyToken, toggleVideoLike);
router.get("/video/:videoId", getLikesByVideo);
router.get("/comment/:commentId", getLikesByComment);
router.get("/tweet/:tweetId", getLikesByTweet);
router.route("/videos").get(getLikedVideos);

export default router;