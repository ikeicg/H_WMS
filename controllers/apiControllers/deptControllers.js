const Department = require("../../models/department");
const Case = require("../../models/case");
const RouteCase = require("../../logic/routingModule");

async function nextCase(req, res) {
  let dptName = req.body.dptName;

  let dpt = await Department.findOne({ name: dptName });

  let nxtCase = await dpt.nextCase();

  if (nxtCase) {
    res.status(200).json({ status: true, message: nxtCase });
  } else {
    res.status(200).json({ status: false, message: nxtCase });
  }
}

async function closeDept(req, res) {
  let { deptName } = req.body;

  let dpt = await Department.findOne({ name: deptName });

  if (dpt) {
    let status = dpt.open;

    if (status) {
      let res1 = await dpt.closeDepartment();
      if (res1.status) {
        if (dpt.cases.length >= 1) {
          dpt.cases.forEach(async (x) => {
            let caze = await Case.findOne({ _id: x }, "addedOn active queued");
            caze.queued = false;
            caze.active = false;
            await caze.save();

            let dpt2 = await RouteCase(x);
            if (dpt2) {
              res.status(200).json(await dpt.transferCase(x, dpt2));
            } else {
              res.status(200).json(await dpt.transferCase(x, "FrontDesk"));
            }
          });
        } else {
          res.status(200).json({ status: true, message: "Succesfully closed" });
        }
      }
    } else {
      res.status(200).json(await dpt.openDepartment());
    }
  } else {
    res.status(422).json({ status: "failed", message: "Invalid Dept." });
  }
}

module.exports = { nextCase, closeDept };
