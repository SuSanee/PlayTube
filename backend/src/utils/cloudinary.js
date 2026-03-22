import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null ;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error on uploading on cloudinary", error);
    return null;
  }
};

const removeFromCloudinary = async (cloudinaryPublicId) => {
  try {
    if (!cloudinaryPublicId) return null;

    const response = await cloudinary.uploader.destroy(cloudinaryPublicId);
    return response;
  } catch (error) {
    console.error("Error in removing image from cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, removeFromCloudinary };
