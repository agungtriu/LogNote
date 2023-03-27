const models = require("../models");
const note = models.note;
const projectuser = models.projectUser;
const project = models.project;
const user = models.user;
class ProjectController {
  static async getAll(req, res) {
    try {
      const projects = await project.findAll({ include: [user] });
      res.json({ status: true, count: projects.length, data: projects });
      // res.render("projects/index.ejs", { projects });
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async createPage(req, res) {
    try {
      const users = await user.findAll();
      res.render("projects/createPage.ejs", { users });
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async create(req, res) {
    try {
      const { name, description, repository, userIds } = req.body;
      const result = await project.create({
        name,
        description,
        repository,
      });
      const values = [];
      userIds.forEach((id) => {
        values.push({ projectId: result.id, userId: id });
      });
      const resultMembers = await projectuser.bulkCreate(values);
      res.json({ status: true, data: result });
      // res.redirect("/projects");
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async delete(req, res) {
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
        res.json({ status: true, data: result });
        // res.redirect("/projects")
      } else {
        res.json({ success: false, error: "No project found" });
      }
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async editPage(req, res) {
    try {
      const id = Number(req.params.id);
      const project = await project.findOne({ where: { id }, include: [user] });
      const users = await user.findAll();
      res.render("projects/editPage.ejs", { project, users });
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async edit(req, res) {
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
      const values = [];
      userIds.forEach((userId) => {
        values.push({ projectId: id, userId: userId });
      });
      const resultMembers = await projectuser.bulkCreate(values);

      if (result[0] === 1) {
        res.json({ status: true, data: result });
        // res.redirect("/projects")
      } else {
        res.json({ success: false, error: "No project found" });
      }
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
}
module.exports = ProjectController;
