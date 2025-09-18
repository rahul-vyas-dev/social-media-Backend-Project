import { Router } from "express";
import {
  createVideo,
  incrementVideoViews,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  getAllVideos,
  searchVideos,
  getVideosByUser,
  toggleVideoPublish,
  getRandomVideos,
  getSubscribedVideos,
  getTrendingVideos,
} from "../controllers/video.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyToken);

router
  .route("/")
  .post(
    upload.fields([{ name: "videoFile" }, { name: "thumbnail" }]),
    createVideo
  )
  .get(getAllVideos);
router.route("/search").get(searchVideos);
router.route("/random").get(getRandomVideos);
router.route("/trending").get(getTrendingVideos);
router.route("/subscriptions").get(getSubscribedVideos);
router.route("/user/:userId").get(getVideosByUser);
router.route("/togglePublish/:videoId").patch(toggleVideoPublish);
router
  .route("/:videoId")
  .get(incrementVideoViews, getVideoById)
  .patch(
    upload.fields([{ name: "videoFile" }, { name: "thumbnail"}]),
    updateVideoById
  )
  .delete(deleteVideoById);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default router;
