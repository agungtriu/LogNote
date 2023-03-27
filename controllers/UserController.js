const { where } = require("sequelize");
const models = require("../models");
const user = models.user;
const profile = models.profile;
const projectUser = models.projectUser;
class UserController {
  static async getAll(req, res) {
    try {
      const users = await user.findAll({
        include: [profile],
        order: [["role", "ASC"]],
      });
      res.render("users/index.ejs", {
        users,
        message: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static registerPage(req, res) {
    res.render("users/register/index.ejs", { message: req.flash("error") });
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
          const getUser = await user.findOne({ where: { username } });
          req.session.username = getUser.username;
          req.session.role = getUser.role;
          message = `${username} has been created`;
          req.flash("success", message);
          res.redirect("/");
        } else {
          message = `${username} not available`;
          req.flash("error", message);
          res.redirect("/users/register");
        }
      } else {
        message = "password and confirm password not match";
        req.flash("error", message);
        res.redirect("/users/register");
      }
    } catch (error) {
      req.flash("error", "Internal Server Error");
      res.redirect("/users/register");
      // res.json({
      //   status: false,
      //   error: error,
      // });
    }
  }
  static loginPage(req, res) {
    res.render("users/login/index.ejs", { message: req.flash("error") });
  }
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await user.findOne({ where: { username } });
      if (result !== null) {
        if (password === result.password) {
          req.session.username = result.username;
          req.session.role = result.role;
          req.flash("success", `Welcome back, ${result.username}`);
          res.redirect("/");
        } else {
          const message = `password false`;
          req.flash("error", message);
          res.redirect("/users/login");
        }
      } else {
        const message = `${username} was not registered`;
        req.flash("error", message);
        res.redirect("/users/login");
      }
    } catch (error) {
      req.flash("error", "Internal Server Error");
      res.redirect("/users/login");
      // res.json({
      //   status: false,
      //   error: error,
      // });
    }
  }
  static logout(req, res) {
    try {
      delete req.session.username;
      delete req.session.role;
      req.flash("success", "You have successfully logged out.");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "Internal Server Error");
      res.redirect("/");
      // res.json({
      //   status: false,
      //   error: "Server Error",
      // });
    }
  }
  static async detailPage(req, res) {
    const username = req.params.username;
    const detail = await user.findOne({
      include: [profile],
      where: { username },
    });
    res.render("users/profiles/index.ejs", {
      detail,
      message: req.flash("success"),
      error: req.flash("error"),
    });
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
        error: error,
      });
    }
  }
  static async editPasswordPage(req, res) {
    const username = req.session.username;
    const paramsUsername = req.params.username;

    if (paramsUsername === username) {
      res.render("users/profiles/editPasswordPage.ejs", {
        error: req.flash("error"),
      });
    } else {
      req.flash("error", "You don't have permission.");
      res.redirect(`/users/detail/${username}`);
    }
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
          req.flash("success", "Password has been changed.");
          res.redirect(`/users/detail/${username}`);
          // message = "password has been changed";
          // res.json({ status: true, message: message });
        } else {
          message = "password cannot change";
          res.json({ status: false, error: message });
        }
      } else {
        message = "password and confirm password not match";
        req.flash("error", message);
        res.redirect(`/users/password/edit/${username}`);
        // res.json({
        //   status: false,
        //   error: message,
        // });
      }
      // res.render("user/editPasswordPage.ejs", message);
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }
  static async editProfilePage(req, res) {
    const username = req.session.username;
    const paramsUsername = req.params.username;

    if (paramsUsername === username) {
      try {
        const username = req.params.username;
        const detail = await user.findOne({
          include: [profile],
          where: { username },
        });
        // res.json({
        //   status: true,
        //   data: detail,
        // });
        res.render("users/profiles/editPage.ejs", {
          detail,
        });
      } catch (error) {
        res.json({
          status: false,
          error: error,
        });
      }
    } else {
      req.flash("error", "You don't have permission.");
      res.redirect(`/users/detail/${username}`);
    }
  }
  static async editProfile(req, res) {
    try {
      const { name, email, position, phone, address } = req.body;
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
          email,
          position,
          phone,
          address,
        },
        { where: { id: userByUsername.profile.id } }
      );
      if (resultProfile[0] === 1 && resultUser[0] === 1) {
        req.flash("success", "Update successfully.");
        res.redirect(`/users/detail/${username}`);
        // res.json({
        //   status: true,
        //   message: "update successfully",
        // });
      }
    } catch (error) {
      res.json({
        status: false,
        error: error,
      });
    }
  }

  static async delete(req, res) {
    if (req.session.username && req.session.role === "admin") {
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
          req.flash("error", `User ${data.id} has been deleted.`);
          res.redirect("/users");
        } else {
          req.flash("error", "No user found.");
          // res.json({ success: false, error: "No user found" });
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

module.exports = UserController;
