const { ProjectController } = require("../controllers");

const projctRoute = require("express").Router();

projctRoute.get("/", ProjectController.getAll);
projctRoute.get("/create", ProjectController.createPage);
projctRoute.post("/create", ProjectController.create);
projctRoute.get("/edit/:id", ProjectController.editPage);
projctRoute.post("/edit/:id", ProjectController.edit);
projctRoute.get("/delete/:id", ProjectController.delete);

module.exports = projctRoute;
