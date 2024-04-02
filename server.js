const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.use(cookieParser());

app.use(express.json());

// public assets
app.use(express.static("public"));

// import routes
const userRouter = require("./routes/user.routes");
const articleRouter = require("./routes/article.routes");

// route declarations
app.use("/api/users", userRouter);
app.use("/api/article", articleRouter);

module.exports = app;
