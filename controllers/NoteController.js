const e = require("express");
const models = require("../models");
const note = models.note;
const project = models.project;
class NoteController {
  static async getAll(req, res) {
    if (req.session.username && req.session.role === "admin") {
      try {
        const notes = await note.findAll({ include: [project] });
        notes.map((note) => {
          const noteImage = note.imageData.toString("base64");
          note["imageData"] = noteImage;
          return note;
        });
        // res.json({ status: true, count: notes.length, data: notes });
        res.render("notes/index.ejs", {
          notes,
          message: req.flash("success"),
          error: req.flash("error"),
        });
      } catch (error) {
        res.json({
          status: false,
          error: error,
        });
      }
    } else {
      res.redirect("/");
    }
  }

  static async addPage(req, res) {
    if (req.session.username && req.session.role === "admin") {
      const projects = await project.findAll({ order: [["id", "ASC"]] });
      res.render("notes/createPage.ejs", { projects });
    } else {
      res.redirect("/");
    }
  }

  static async add(req, res) {
    if (req.session.username && req.session.role === "admin") {
      try {
        const { text, projectId } = req.body;
        const imageType = req.file.mimetype;
        const imageName = req.file.originalname;
        const imageData = req.file.buffer;
        const result = await note.create({
          imageType,
          imageName,
          imageData,
          text,
          projectId,
        });
        // res.json({ status: true, data: result });
        req.flash("success", "Note has been created.");
        res.redirect("/notes");
      } catch (error) {
        res.json({
          status: false,
          error: error,
        });
      }
    } else {
      res.redirect("/");
    }
  }

  static async delete(req, res) {
    if (req.session.username && req.session.role === "admin") {
      try {
        const id = Number(req.params.id);
        const result = await note.destroy({
          where: { id },
        });

        if (result === 1) {
          // res.json({ status: true, data: result });
          req.flash("error", "Note has been deleted.");
          res.redirect("/notes");
        } else {
          res.json({ success: false, error: "note not found" });
        }
      } catch (error) {
        res.json({
          status: false,
          error: error,
        });
      }
    } else {
    }
  }
}
module.exports = NoteController;
