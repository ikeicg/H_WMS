const Case = require("../../models/case");
const Department = require("../../models/department");
const RouteCase = require("../../logic/routingModule");

function createCase(req, res) {
  const { patientName, severity } = req.body;

  let newCase = new Case({
    patientName,
    open: true,
    queued: true,
    active: false,
    diagnosis: [],
    vitals: [],
    treatmentPlan: [],
    severity,
    addedOn: Date.now(),
    createdOn: Date.now(),
  });

  newCase.save().then(async (data) => {
    await Department.updateOne(
      { name: "Triage" },
      { $push: { cases: data._id } }
    );
    res.status(201).json({ status: true, message: "New Case created" });
  });
}

async function transferCase(req, res) {
  let { dept1, caseId, dept2 } = req.body;

  //Find the first department
  let doc = await Department.findOne({ name: dept1 });

  // grab case using caseId, set active and queued to false
  let caze = await Case.findOne({ _id: caseId });
  let tTime = Date.now() - caze.addedOn;
  caze.active = false;
  caze.queued = false;
  await caze.save();

  // If the second dept is 0, that means route the case
  if (dept2 == 0) {
    dept2 = await RouteCase(caseId);
  }
  let doc2 = await Department.findOne({ name: dept2 });

  if (!doc2 || !doc) {
    caze.active = false;
    caze.queued = true;
    await caze.save();

    res.status(200).json({ status: false, message: "Non-existent department" });
  } else {
    await doc.addProductivityMetric(tTime);
    res.status(200).json(await doc.transferCase(caseId, dept2));
  }
}

async function triageAdd(req, res) {
  const temp = req.body.temperature;
  const bPres = req.body.bloodPressure;
  const svrt = req.body.severity;
  let caze = req.body.caseId;

  try {
    caze = await Case.findOne({ _id: caze });
    await caze.addVitals(temp, bPres);
    if (svrt) {
      await caze.setSeverity(svrt);
    }

    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function setSeverity(req, res) {
  const { severity, caseId } = req.body;

  try {
    caze = await Case.findOne({ _id: caseId });
    await caze.setSeverity(severity);
    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function addDiagnosis(req, res) {
  const { body, staffId, caseId } = req.body;

  try {
    caze = await Case.findOne({ _id: caseId });
    await caze.addDiagnosis(body, staffId);
    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function addTreatment(req, res) {
  const { prodId, objective, caseId } = req.body;

  try {
    caze = await Case.findOne({ _id: caseId });
    await caze.addTreatment(prodId, objective);
    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function scheduleCase(req, res) {
  const { prodId, caseId, date } = req.body;

  try {
    caze = await Case.findOne({ _id: caseId });
    await caze.scheduleProcedure(prodId, date);
    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function closeCase(req, res) {
  const { prodId, caseId, text } = req.body;

  try {
    caze = await Case.findOne({ _id: caseId });
    await caze.documentProcedure(prodId, text);
    await caze.closeProcedure(prodId);
    res.status(200).json({ status: true, message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(422).json({ status: false, message: "Failed" });
  }
}

async function recallCase(req, res) {
  const { caseId, deptName } = req.body;

  try {
    let response = await Department.updateOne(
      { name: deptName },
      { $pull: { cases: caseId } }
    );

    if (response) {
      let caze = await Case.findOne({ _id: caseId }, "queued active");
      caze.queued = false;
      caze.active = false;
      await caze.save();

      res.status(200).json({ status: true, message: "successful" });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "successful" });
  }
}

async function dischargeCase(req, res) {
  const { caseId } = req.body;

  try {
    let response = await Department.updateMany(
      { cases: caseId },
      { $pull: { cases: caseId } }
    );

    let caze = await Case.findOne({ _id: caseId }, "open queued active");
    caze.open = false;
    caze.queued = false;
    caze.active = false;
    await caze.save();

    res.status(200).json({ status: true, message: "successful" });
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "failure" });
  }
}

async function reactivateCase(req, res) {
  let { caseId } = req.body;

  let dest = await RouteCase(caseId);

  if (dest) {
    let dept = await Department.findOne({ name: dest });
    dept.cases.push(caseId);
    let res1 = await dept.save();

    if (res1) {
      let caze = await Case.findOne({ _id: caseId });
      caze.active = false;
      caze.queued = true;
      caze.addedOn = Date.now();
      caze.save().then((response) => {
        res.status(200).json({ status: true });
      });
    } else {
      res.status(200).json({ status: false });
    }
  }
}

module.exports = {
  createCase,
  transferCase,
  triageAdd,
  setSeverity,
  addDiagnosis,
  addTreatment,
  scheduleCase,
  closeCase,
  recallCase,
  dischargeCase,
  reactivateCase,
};
