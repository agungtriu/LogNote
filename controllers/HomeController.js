const models = require("../models");
const sequelize = require("sequelize");
const note = models.note;
const project = models.project;

class HomeController {
  static async getHome(req, res) {
    try {
      const notes = await note.findAll({
        include: [project],
      });
      notes.map((note) => {
        if (note.imageData) {
          const noteImage = note.imageData.toString("base64");
          note["imageData"] = noteImage;
        }
        return note;
      });
      // res.json({ status: true, count: notes.length, data: notes });
      res.render("index.ejs", {
        notes,
        message: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        error: error,
      });
    }
  }
}

module.exports = HomeController;
