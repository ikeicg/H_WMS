const Department = require("../models/department");

const getDashboard = async (req, res) => {
  const path = req.query.path || null;

  let dptName = req.user.role;

  let department = await Department.findOne(
    { name: dptName },
    "name cases open"
  ).populate({
    path: "cases",
    populate: [
      {
        path: "treatmentPlan.procedure",
        select: "department name",
        populate: {
          path: "department",
          select: "name",
        },
      },
      { path: "diagnosis.staff", select: "name" },
      { path: "treatmentPlan.documentation.staff", select: "name" },
    ],
  });

  let activecases = department.cases.filter((x) => {
    return x.active == true;
  });

  activecases.forEach((x) => {
    x.treatmentPlan = x.treatmentPlan.filter((y) => {
      return dptName == "Physician" || y.procedure.department.name == dptName;
    });
  });

  res.render("dashboard", { path: path, user: req.user, cases: activecases });
};

module.exports = {
  getDashboard,
};
