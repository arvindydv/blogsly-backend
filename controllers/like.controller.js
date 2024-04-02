const { asyncHandler } = require("../utility/asyncHandler");

//  like blog controller
const toglgleLike = asyncHandler(async (req, res) => {});

// get my liked blogs
const getLikedBlogs = asyncHandler(async (req, res) => {});

module.exports = {
  toglgleLike,
  getLikedBlogs,
};
