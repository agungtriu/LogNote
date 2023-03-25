const route = require("express").Router();
route.get("/", (req, res) => {
  // res.render("index.ejs");
  res.json({
    status: true,
    message: "home",
  });
});

const noteRoutes = require("./noteRoute");
const projectRoutes = require("./projectRoute");
const userRoutes = require("./userRoute");

route.use("/notes", noteRoutes);
route.use("/projects", projectRoutes);
route.use("/users", userRoutes);
module.exports = route;
