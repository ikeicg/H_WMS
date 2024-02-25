const Department = require("../../models/department");

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

module.exports = { nextCase };
