const Case = require("../models/case");
const Department = require("../models/department");

module.exports = async (caseId) => {
  // Find all closed departments
  let closedDpts = await Department.find({ open: false }, "name");
  closedDpts = closedDpts.map((x) => x.name);

  //Find the case
  let caze = await Case.findOne(
    { _id: caseId },
    "treatmentPlan.procedure treatmentPlan.scheduled treatmentPlan.open treatmentPlan.active queued"
  ).populate({
    path: "treatmentPlan.procedure",
    select: "department",
    populate: {
      path: "department",
      select: "name",
    },
  });

  if (caze) {
    let departments = {};
    let numOfLiveProcds = 0;

    // if a case is already queued, do nothing else proceed
    if (!caze.queued) {
      caze.treatmentPlan.forEach((x) => {
        // If any procedure is active, do nothing
        if (x.active) return "";

        // Set scheduled state for procedures from closed departments to true
        if (closedDpts.includes(x.procedure.department.name)) {
          x.scheduled = true;
        }

        // Find procedures that are still open and not scheduled
        if (x.open == true && x.scheduled == false) {
          let dptName = x.procedure.department.name;
          if (!departments.hasOwnProperty(dptName)) {
            departments[dptName] = 0;
          }
          numOfLiveProcds += 1;
        }
      });

      // Save the case after modifications
      await caze.save();

      // If the case has no live procedures, report back to FrontDesk
      if (numOfLiveProcds == 0) return "FrontDesk";

      // Find the latency metric for each department
      for (let key in departments) {
        let dpt = await Department.findOne({ name: key });
        let dptLat = await dpt.latencyMetric();
        departments[key] = dptLat;
      }

      //Sort the departments
      let sortDpt = Object.entries(departments);
      sortDpt.sort((a, b) => Number(a[1]) - Number(b[1]));

      // return the department with best metrics
      return sortDpt[0][0];
    } else {
      return "";
    }
  } else {
    return "";
  }
};
