import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByVideo,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/:videoId", createComment);
router.route("/:commentId").delete(deleteComment).put(updateComment);
router.get("/video/:videoId", getCommentsByVideo);

export default router;
