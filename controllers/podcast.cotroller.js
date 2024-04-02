const { asyncHandler } = require("../utility/asyncHandler");
const { ApiError } = require("../utility/ApiError");
const model = require("../models");
const { ApiResponse } = require("../utility/ApiResponse");

// upload post cast
const createPostCast = asyncHandler(async (req, res) => {
  const payload = req.body;

  // if title is empty
  if ([payload.title].some((field) => field?.trim() === "")) {
    throw new ApiError(422, "title is required");
  }

  const podcastLocatPath = req.files?.podcast[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail;

  // let thumbnailLocalPath ;
  //   if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
  //     thumbnailLocalPath = req.files.thumbnail[0].path
  //   }

  if (!podcastLocatPath || !thumbnailLocalPath) {
    throw new ApiError(422, "podcast and thumbnail are required");
  }

  const podcast = await uploadOnCloudinary(podcastLocatPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!podcast || !thumbnail) {
    throw new ApiError(500, "error while uploading podcast and thumbnail");
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const podcastData = await model.Podcast.create({
    title: payload.title,
    thumbnail: thumbnail,
    podcast: podcast,
    userId: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, podcastData, "podcast created successfully"));
});

// update podcast controller
const updatePodcast = asyncHandler(async (req, res) => {});

// get All podcast
const allPodcasts = asyncHandler(async (req, res) => {
  const podcast = await model.Podcast.findAll();
  return res
    .status(200)
    .json(new ApiResponse(200, podcast, "all podcast got successfully"));
});

// get my podcast
const myPodcast = asyncHandler(async (req, res) => {
  const podcast = model.Podcast.findAll({
    where: {
      userId: req.user.id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, podcast, "all podcast got successfully"));
});

module.exports = {
  createPostCast,
  updatePodcast,
  allPodcasts,
  myPodcast,
};
