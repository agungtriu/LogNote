const { NoteController } = require("../controllers");
const multer = require("multer")
const upload = multer()

const noteRoute = require("express").Router();

noteRoute.get("/", NoteController.getAll);
noteRoute.post("/add", upload.single('image'), NoteController.add);
noteRoute.get("/delete/:id", NoteController.delete);

module.exports = noteRoute;
