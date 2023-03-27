const { HomeController } = require("../controllers");

const homeRoute = require("express").Router();

homeRoute.get("/", HomeController.getHome);

module.exports = homeRoute;
