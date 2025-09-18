import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getSubscriptions,
  getSubscribers,
} from "../controllers/subscription.controller.js";
import {verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyToken);

router.post("/subscribe/:channelId", subscribe);
router.post("/unsubscribe/:channelId", unsubscribe);
router.get("/userSubscriptions", getSubscriptions);
router.get("/subscribers/:channelId", getSubscribers);

export default router;