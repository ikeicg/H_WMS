const Department = require("../models/department");
const Message = require("../models/message");
const Case = require("../models/case");

const getDashboard = async (req, res) => {
  const path = req.query.path || null;

  const caseId = req.query.cid || null;

  let dptName = req.user.role;

  let departments = await Department.find({});

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
    ],
  });

  let messages = await Message.find({
    $or: [{ sender: dptName }, { recipient: dptName }],
    time: { $gte: Date.now() - 24 * 60 * 60 * 1000 }, // Messages sent within the last 24 hours
  });

  let activecases = department.cases.filter((x) => {
    return x.active == true;
  });

  activecases.forEach((x) => {
    x.treatmentPlan = x.treatmentPlan.filter((y) => {
      return dptName == "Physician" || y.procedure.department.name == dptName;
    });
  });

  let caze = "";

  if (caseId) {
    let res1 = await Case.findOne({ _id: caseId }).populate([
      {
        path: "treatmentPlan.procedure",
        select: "department name",
        populate: { path: "department", select: "name" },
      },
    ]);

    if (res1) {
      caze = res1;
    }
  }

  res.render("dashboard", {
    path: path,
    user: req.user,
    cases: activecases,
    deptStatus: department.open,
    departments,
    messages,
    caze,
  });
};

module.exports = {
  getDashboard,
};
