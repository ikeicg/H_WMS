const Staff = require("../models/staff");
const Department = require("../models/department");
const mongoose = require("mongoose");

const postUserLogin = (req, res) => {
  Staff.findOne({ employeeId: req.body.employee_id }).then((staffer) => {
    if (staffer) {
      if (staffer.password == req.body.passwd) {
        req.session.user = { id: staffer._id, role: staffer.role };
        res.status(200).redirect("/dashboard");
      } else {
        res.status(400).redirect("/"); //Invalid Password
      }
    } else {
      res.status(400).redirect("/"); //Invalid Username
    }
  });
};

const getUserLogin = (req, res) => {
  res.render("login");
};

const getUserLogout = (req, res) => {
  req.session.destroy();
  res.json({ message: "logout done", redirect: "/" });
};

module.exports = {
  postUserLogin,
  getUserLogin,
  getUserLogout,
};
