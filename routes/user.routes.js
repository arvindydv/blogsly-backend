const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller");
const verifyJwt = require("../middlewares/auth.midleware");
const { upload } = require("../middlewares/multer.midleware");

const router = Router();

// router.route("/signup").post(registrationValidator, registerUser);
router.post(
  "/signup",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImg",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);

module.exports = router;
