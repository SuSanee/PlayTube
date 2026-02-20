import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  uploadVideo,
  updateVideoDetails,
  updateThumbnail,
  deleteVideo,
  togglePublishStatus,
  getChannelVideos,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/all").get(getAllVideos);
router.route("/channel/:username").get(getChannelVideos);

// Private routes
router.route("/upload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);
router.route("/:id").patch(verifyJWT, updateVideoDetails);
router
  .route("/:id/thumbnail")
  .patch(verifyJWT, upload.single("thumbnail"), updateThumbnail);
router.route("/:id").delete(verifyJWT, deleteVideo);
router.route("/:id/toggle_publish_status").patch(verifyJWT, togglePublishStatus);

export default router;