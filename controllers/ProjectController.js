const e = require("express");
const models = require("../models");
const note = models.note;
const projectuser = models.projectUser;
const project = models.project;
const user = models.user;
class ProjectController {
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
        // res.json({ status: true, count: projects.length, data: projects });
        res.render("projects/index.ejs", {
          projects,
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
  static async createPage(req, res) {
    if (req.session.username) {
      try {
        let users = await user.findAll({
          order: [["id", "ASC"]],
        });
        users = users.filter((user) => user.username !== req.session.username);
        res.render("projects/createPage.ejs", { users });
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
  static async create(req, res) {
    if (req.session.username) {
      try {
        const { name, description, repository, userIds } = req.body;
        const selfId = req.session.userId;
        const result = await project.create({
          name,
          description,
          repository,
        });
        if (userIds !== undefined) {
          const values = [];
          values.push({ projectId: result.id, userId: selfId });
          if (typeof userIds === "object") {
            userIds.forEach((id) => {
              values.push({ projectId: result.id, userId: id });
            });
          } else {
            values.push({ projectId: result.id, userId: userIds });
          }
          await projectuser.bulkCreate(values);
        } else {
          await projectuser.create({ projectId: result.id, userId: selfId });
        }
        req.flash("success", `Project "${name}" has been created.`);
        res.redirect("/projects");
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
        const result = await project.destroy({
          where: { id },
        });
        const deleteNote = await note.destroy({
          where: { projectId: id },
        });
        const deleteProjectUser = await projectuser.destroy({
          where: { projectId: id },
        });
        if (result === 1) {
          // res.json({ status: true, data: result });
          req.flash("error", `Project ${id} has been deleted.`);
          res.redirect("/projects");
        } else {
          res.json({ success: false, error: "No project found" });
        }
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
  static async editPage(req, res) {
    if (req.session.username) {
      try {
        const id = Number(req.params.id);
        const projects = await project.findOne({
          where: { id },
          include: [user],
        });
        let users = await user.findAll({ order: [["username", "ASC"]] });
        users = users.filter((user) => user.username !== req.session.username);
        res.render("projects/editPage.ejs", { projects, users });
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
  static async edit(req, res) {
    if (req.session.username) {
      try {
        const id = Number(req.params.id);
        const { name, description, repository, userIds } = req.body;
        const result = await project.update(
          {
            name,
            description,
            repository,
          },
          { where: { id } }
        );

        const deleteProjectUser = await projectuser.destroy({
          where: { projectId: id },
        });
        const selfId = req.session.userId;
        if (userIds !== undefined) {
          const values = [];
          values.push({ projectId: id, userId: selfId });
          if (typeof userIds === "object") {
            userIds.forEach((id) => {
              values.push({ projectId: id, userId: id });
            });
          } else {
            values.push({ projectId: id, userId: userIds });
          }
          await projectuser.bulkCreate(values);
        } else {
          await projectuser.create({ projectId: id, userId: selfId });
        }

        if (result[0] === 1) {
          // res.json({ status: true, data: result });
          req.flash("success", `Project ${id} has been updated.`);
          res.redirect("/projects");
        } else {
          req.flash("error", "No project found");
          // res.json({ success: false, error: "No project found" });
        }
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
}
module.exports = ProjectController;
