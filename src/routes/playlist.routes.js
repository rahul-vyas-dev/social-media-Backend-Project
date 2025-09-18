import { Router } from "express";
import {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  getUserPlaylists,
  getPlaylistDetails,
  updatePlaylistDetails,
} from "../controllers/playlist.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:playlistId", getPlaylistDetails);
router.post("/:playlistId/videos", addVideoToPlaylist);
router.delete("/:playlistId", deletePlaylist);
router.put("/:playlistId", updatePlaylistDetails);
router.delete("/:playlistId/videos/:videoId", removeVideoFromPlaylist);

export default router;