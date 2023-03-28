const { UserController } = require("../controllers");

const userRoute = require("express").Router();

userRoute.get("/", UserController.getAll);
userRoute.get("/register", UserController.registerPage);
userRoute.post("/register", UserController.register);
userRoute.get("/login", UserController.loginPage);
userRoute.post("/login", UserController.login);
userRoute.get("/logout", UserController.logout);
userRoute.get("/detail/:username", UserController.detailPage);
userRoute.get("/detail/:username", UserController.detail);
userRoute.get("/delete/:username", UserController.delete);
userRoute.get("/edit/:username", UserController.editProfilePage);
userRoute.post("/edit/:username", UserController.editProfile);
userRoute.get("/password/edit/:username", UserController.editPasswordPage);
userRoute.post("/password/edit/:username", UserController.editPassword);

module.exports = userRoute;
