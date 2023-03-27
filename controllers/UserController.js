const { where } = require("sequelize");
const models = require("../models");
const user = models.user;
const profile = models.profile;
const projectUser = models.projectUser;
class UserController {
  static async getAll(req, res) {
    try {
      const users = await user.findAll({ include: [profile] });
      res.json({ status: true, count: users.length, data: users });
      // res.render("users/index.ejs", { users });
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static registerPage(req, res) {
    res.render("user/registerPage.ejs");
  }
  static async register(req, res) {
    try {
      const { username, name, password, confirmPassword } = req.body;
      let message = "";
      if (password === confirmPassword) {
        const result = await user.findOne({ where: { username } });
        if (result === null) {
          const result = await user.create({
            username,
            name,
            password,
          });
          const resultProfile = await profile.create({
            userId: result.id,
          });
          message = `${username} has been created`;
          res.json({ status: true, message: message, result: result });
        } else {
          message = `${username} not available`;
          res.json({ status: false, message: message });
        }
      } else {
        message = "password and confirm password not match";
        res.json({
          status: false,
          error: message,
        });
      }
      // res.render("users/registerPage.ejs", { message });
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static loginPage(req, res) {
    res.render("user/loginPage.ejs");
  }
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await user.findOne({ where: { username } });
      if (result !== null) {
        if (password === result.password) {
          res.json({ status: true, data: result });
          // res.redirect("/notes");
        } else {
          const message = `password false`;
          res.json({ status: false, error: message });
          // res.render("users/loginPage.ejs", { message });
        }
      } else {
        const message = `${username} was not registered`;
        res.json({ status: false, error: message });
        // res.render("users/loginPage.ejs", { message });
      }
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static async detail(req, res) {
    try {
      const username = req.params.username;
      const detail = await user.findOne({
        include: [profile],
        where: { username },
      });
      if (detail !== null) {
        res.json({
          status: true,
          data: detail,
        });
        // res.render("users/detail.ejs", { detail });
      } else {
        res.json({
          status: false,
          error: "not found",
        });
        // res.redirect("/notes");
      }
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static editPasswordPage(req, res) {
    res.render("user/editPasswordPage.ejs");
  }
  static async editPassword(req, res) {
    try {
      const { password, confirmpassword } = req.body;
      const username = req.params.username;
      let message = "";
      if (password === confirmpassword) {
        const result = await user.update(
          {
            password,
          },
          { where: { username } }
        );
        if (result[0] === 1) {
          message = "password has been changed";
          res.json({ status: true, message: message });
        } else {
          message = "password cannot change";
          res.json({ status: false, error: message });
        }
      } else {
        message = "password and confirm password not match";
        res.json({
          status: false,
          error: message,
        });
      }
      // res.render("user/editPasswordPage.ejs", message);
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static async editProfilePage(req, res) {
    try {
      const username = req.params.username;
      const detail = await user.findOne({
        include: [profile],
        where: { username },
      });
      res.json({
        status: true,
        data: detail,
      });
      // res.render("user/editProfilPage.ejs", {detail})
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
  static async editProfile(req, res) {
    try {
      const { name, phone, address } = req.body;
      const username = req.params.username;
      const resultUser = await user.update(
        {
          name,
        },
        { where: { username } }
      );
      const userByUsername = await user.findOne({
        where: { username },
        include: [profile],
      });
      const resultProfile = await profile.update(
        {
          phone,
          address,
        },
        { where: { id: userByUsername.profile.id } }
      );
      if (resultProfile[0] === 1 && resultUser[0] === 1) {
        res.json({
          status: true,
          message: "update successfully",
        });
        // res.redirect(`/detail/${username}`)
      }
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }

  static async delete(req, res) {
    try {
      const username = req.params.username;
      const data = await user.findOne({ where: { username } });
      if (data !== null) {
        const deleteUser = await user.destroy({ where: { username } });
        const deleteProfile = await profile.destroy({
          where: { userId: data.id },
        });
        const deleteProjectUser = await projectUser.destroy({
          where: { userId: data.id },
        });
        res.redirect("/users");
      } else {
        res.json({ success: false, error: "No user found" });
      }
    } catch (error) {
      res.json({
        status: false,
        error: "Server Error",
      });
    }
  }
}

module.exports = UserController;
