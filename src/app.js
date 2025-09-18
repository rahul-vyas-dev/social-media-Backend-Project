import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

const corsOptions = {
  // const corsOptions = { origin: '*' } // for development only
  origin: process.env.CORS_ORIGIN || "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  Credential: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: false,limit: "10kb" }));
app.use(cookieParser());
app.use(express.static('public'));

//routes for user management
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";

//middleware to handle user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/tweets", tweetRoutes);

export default app;
