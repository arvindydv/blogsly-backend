const { Router } = require("express");
const {
  postArticle,
  getAllArticles,
  myArticle,
  publishArticle,
  updateArticle,
  updateCoverImg,
} = require("../controllers/article.controller");
const verifyJwt = require("../middlewares/auth.midleware");
const { upload } = require("../middlewares/multer.midleware");
const router = Router();

router.post(
  "/post",
  verifyJwt,
  upload.fields([
    {
      name: "coverImg",
      maxCount: 1,
    },
  ]),
  postArticle
);

router.get("/articles", verifyJwt, getAllArticles);
router.get("/my-articles", verifyJwt, myArticle);
router.post("/publish/:id", verifyJwt, publishArticle);
router.patch("/articles/:id", verifyJwt, updateArticle);
router.patch(
  "/cover-img/:id",
  verifyJwt,
  upload.fields([
    {
      name: "coverImg",
      maxCount: 1,
    },
  ]),
  updateCoverImg
);

module.exports = router;
