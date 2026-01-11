import { Router } from "express";
import {
  changeCurrentPassword,
  updateUserDetails,
  updateAvatarImage,
  updateCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/change_password").post(verifyJWT, changeCurrentPassword);
router.route("/update_user").patch(verifyJWT, updateUserDetails);
router
  .route("/update_avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatarImage);
router
  .route("/update_coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch_history").get(verifyJWT, getUserWatchHistory);

export default router;
