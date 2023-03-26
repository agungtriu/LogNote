const models = require("../models");
const note = models.note;
const project = models.project;
class NoteController {
  static async getAll(req, res) {
    try {
      const notes = await note.findAll({ include: [project] });
      notes.map((note) => {
        const noteImage = note.imageData.toString("base64");
        note["imageData"] = noteImage;
        return note;
      });
      res.json({ status: true, count: notes.length, data: notes });
      // res.render("notes/index.ejs", { notes });
    } catch (error) {
      res.json({
        status: false,
        error: "server error",
      });
    }
  }

  static async add(req, res) {
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
      res.json({ status: true, data: result });
      // res.redirect("/notes");
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
      const result = await note.destroy({
        where: { id },
      });

      if (result === 1) {
        res.json({ status: true, data: result });
        // res.redirect("/notes")
      } else {
        res.json({ success: false, error: "note not found" });
      }
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
}
module.exports = NoteController;
