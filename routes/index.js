const route = require("express").Router();
const homeRoutes = require("./homeRoute");
const noteRoutes = require("./noteRoute");
const projectRoutes = require("./projectRoute");
const userRoutes = require("./userRoute");

route.use("/", homeRoutes);
route.use("/notes", noteRoutes);
route.use("/projects", projectRoutes);
route.use("/users", userRoutes);
module.exports = route;
