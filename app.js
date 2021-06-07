const express = require("express");
const app = express();
const port = 3003;
const middleware = require("./middleware");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require("express-session");

const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static("public"));

app.use(session({
  secret: "Milk Shake",
  resave: true,
  saveUninitialized: false
}));

app.use(express.urlencoded({
  extended: false
}));

// Routes
const loginRoute = require("./routes/loginRoutes");
const logoutRoute = require("./routes/logoutRoutes");
const registerRoute = require("./routes/registerRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const uploadRoute = require("./routes/uploadRoutes");

// API
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");

app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/post", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

  const payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJS: JSON.stringify(req.session.user)
  }

  res.status(200).render("home", payload);
});