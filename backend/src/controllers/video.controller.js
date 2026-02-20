import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
    query,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Build match stage — only published videos
  const matchStage = { isPublished: true };

  // Optional: search by title (case-insensitive partial match)
  if (query?.trim()) {
    matchStage.title = { $regex: query.trim(), $options: "i" };
  }

  // Allowed sort fields to prevent injection
  const allowedSortFields = ["createdAt", "views", "duration", "title"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const aggregate = Video.aggregate([
    { $match: matchStage },
    { $sort: { [sortField]: sortDirection } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        owner: 1,
        createdAt: 1,
      },
    },
  ]);

  const options = {
    page: pageNum,
    limit: limitNum,
  };

  const result = await Video.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalVideos: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
      "Videos fetched successfully"
    )
  );
});

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (title.trim().length > 100) {
    throw new ApiError(400, "Title must be 100 characters or less");
  }

  if (description.trim().length > 5000) {
    throw new ApiError(400, "Description must be 5000 characters or less");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Both Video and Thumbnail are required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "Error on uploading video and Thumbnail on cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    videoPublicId: videoFile.public_id,
    thumbnail: thumbnail.url,
    thumbnailPublicId: thumbnail.public_id,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user._id,
    isPublished: true,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  const { title, description } = req.body;

  if (!title?.trim() && !description?.trim()) {
    throw new ApiError(400, "Atleast one field is required to update");
  }

  if (title?.trim()) {
    video.title = title.trim();
  }

  if (description?.trim()) {
    video.description = description.trim();
  }

  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const video = await Video.findById(req.params.id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Error while uploading thumbnail on cloudinary");
  }

  const oldThumbnailPublicId = video.thumbnailPublicId;

  video.thumbnail = thumbnail.url;
  video.thumbnailPublicId = thumbnail.public_id;

  await video.save({ validateBeforeSave: false });

  if (oldThumbnailPublicId) {
    await removeFromCloudinary(oldThumbnailPublicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Thumbnail updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  if (video.videoPublicId) {
    await removeFromCloudinary(video.videoPublicId);
  }

  if (video.thumbnailPublicId) {
    await removeFromCloudinary(video.thumbnailPublicId);
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const videos = await Video.find({ owner: user._id, isPublished: true });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this video");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  getAllVideos,
  uploadVideo,
  updateVideoDetails,
  updateThumbnail,
  getChannelVideos,
  deleteVideo,
  togglePublishStatus,
};
