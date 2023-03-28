const e = require("express");
const { where } = require("sequelize");
const models = require("../models");
const note = models.note;
const project = models.project;
const user = models.user;
class NoteController {
  static async getAll(req, res) {
    if (req.session.username) {
      try {
        const allProjects = await project.findAll({
          include: [user],
          order: [["id", "ASC"]],
        });
        const projects = [];
        if (req.session.role === "user") {
          allProjects.forEach((project) => {
            project.users.forEach((user) => {
              if (user.dataValues.username === req.session.username) {
                projects.push(project);
              }
            });
          });
        } else {
          projects.push(...allProjects);
        }
        const projectIds = projects.map((project) => project.dataValues.id);
        const notes = await note.findAll({
          include: [project],
          where: { projectId: projectIds },
        });
        notes.map((note) => {
          if (note.imageData) {
            const noteImage = note.imageData.toString("base64");
            note["imageData"] = noteImage;
            return note;
          }
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
    if (req.session.username) {
      const allProjects = await project.findAll({
        include: [user],
        order: [["id", "ASC"]],
      });
      const projects = [];
      if (req.session.role === "user") {
        allProjects.forEach((project) => {
          project.users.forEach((user) => {
            if (user.dataValues.username === req.session.username) {
              projects.push(project);
            }
          });
        });
      } else {
        projects.push(...allProjects);
      }
      res.render("notes/createPage.ejs", { projects });
    } else {
      res.redirect("/");
    }
  }

  static async add(req, res) {
    if (req.session.username) {
      try {
        let result;
        const { text, projectId } = req.body;
        if (req.file) {
          const imageType = req.file.mimetype;
          const imageName = req.file.originalname;
          const imageData = req.file.buffer;

          result = await note.create({
            imageType,
            imageName,
            imageData,
            text,
            projectId,
          });
        } else {
          result = await note.create({
            imageType: null,
            imageName: null,
            imageData: null,
            text,
            projectId,
          });
        }
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
    if (req.session.username) {
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
