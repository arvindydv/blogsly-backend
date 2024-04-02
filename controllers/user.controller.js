const { asyncHandler } = require("../utility/asyncHandler");
const userValidation = require("../validators/user.validators");
const { ApiError } = require("../utility/ApiError");
const bcrypt = require("bcrypt");
const model = require("../models");
const { ApiResponse } = require("../utility/ApiResponse");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary } = require("../utility/cloudinary");

// generate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await model.User.findByPk(userId);

  try {
    const accessToken = await jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = await jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    user.refreshToken = refreshToken;
    await user.save({ validate: false });
    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return tokens;
  } catch (error) {
    throw new ApiError(500, "error while generating tokens");
  }
};

// register user api
const registerUser = asyncHandler(async (req, res) => {
  const payload = req.body;

  //   invalid payload
  if (
    [
      payload.name,
      payload.email,
      payload.about,
      payload.password,
      payload.lastName,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(422, "invalid payload");
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImgLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.coverImg.length > 0
  ) {
    coverImgLocalPath = req.files.coverImg[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImgLocalPath);

  //   check user exist or not
  const existUser = await model.User.findOne({
    where: { email: payload.email },
  });

  if (existUser) {
    throw new ApiError(400, "user already exists");
  }

  //    encrypt user password
  payload.password = await bcrypt.hash(payload.password, 10);
  payload.avatar = avatar?.url || "";
  payload.coverImg = coverImg?.url || "";

  const user = await model.User.create(payload);
  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    coverImg: user.coverImg,
    about: user.about,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, response, "user registered successfully"));
});

// login user api
const loginUser = asyncHandler(async (req, res) => {
  const payload = req.body;
  // if email  and username is empty
  if (!payload.email && !payload.userName) {
    throw new ApiError(422, "please enter username or email");
  }

  if (!payload.password) {
    throw new ApiError(422, "please enter password");
  }

  // find user
  const user = await model.User.findOne({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //  verify password
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  const tokens = await generateAccessTokenAndRefreshToken(user.id);

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", tokens.accessToken, options)
    .cookie("refreshToken", tokens.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        "user logged in successfully"
      )
    );
});

// logout user api
const logoutUser = asyncHandler(async (req, res) => {
  await model.User.update(
    { refreshToken: null },
    { where: { id: req.user.id }, returning: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
