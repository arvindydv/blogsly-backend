const { ApiError } = require("../utility/ApiError");
const { asyncHandler } = require("../utility/asyncHandler");
const model = require("../models");
const { ApiResponse } = require("../utility/ApiResponse");

// post article controller
const postArticle = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (
    [payload.title, payload.description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(422, "Title and description are required");
  }
  payload?.category.trim();

  let coverImgLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImg) &&
    req.files.coverImg.length > 0
  ) {
    coverImgLocalPath = req.files.coverImg[0].path;
  }

  const coverImg = await uploadOnCloudinary(coverImgLocalPath);

  const article = await model.Article.create({
    title: payload.title,
    description: payload.description,
    userId: req.user.id,
    coverImg: coverImg?.url || "",
    category: payload.category,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, article, "article posted successfully"));
});

// get All articles controller
const getAllArticles = asyncHandler(async (req, res) => {
  const articles = await model.Article.findAll();
  return res
    .status(200)
    .json(new ApiResponse(200, articles, "All articles got successfully"));
});

// get my articles controller
const myArticle = asyncHandler(async (req, res) => {
  const articles = await model.Article.findAll({
    where: {
      userId: req.user.id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, articles, "All articles got successfully"));
});

// toglgle publish articles controller
const publishArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;

  const article = await model.Article.findOne({
    where: {
      userId: userId,
      id: articleId,
    },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }
  article.isPublished = true;

  const articlePublished = await model.Article.update(article, {
    where: {
      id: articleId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, articlePublished, "article published successfully")
    );
});

// update article controller
const updateArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const payload = req.body;

  const article = await model.Article.findOne({
    where: {
      userId: userId,
      id: articleId,
    },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const updatedArticle = await model.Article.update(payload, {
    where: {
      id: articleId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedArticle, "article updated successfully"));
});

// update cover images
const updateCoverImg = asyncHandler(async (req, res) => {
  const articleId = req.params.id;

  const article = await model.Article.findOne({
    where: {
      userId: userId,
      id: articleId,
    },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  let coverImgLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImg) &&
    req.files.coverImg.length > 0
  ) {
    coverImgLocalPath = req.files.coverImg[0].path;
  }

  const coverImg = await uploadOnCloudinary(coverImgLocalPath);
  article.coverImg = coverImg;

  const updatedArticle = await model.Article.update(payload, {
    where: {
      id: articleId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedArticle, "cover image updated successfully")
    );
});

module.exports = {
  postArticle,
  getAllArticles,
  myArticle,
  publishArticle,
  updateArticle,
  updateCoverImg,
};
