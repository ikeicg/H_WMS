const { Router } = require("express");
const isAuth = require("../utils/isAuth");
const {
  createCase,
  transferCase,
  triageAdd,
  setSeverity,
  addDiagnosis,
  addTreatment,
  scheduleCase,
  closeCase,
  recallCase,
} = require("../controllers/apiControllers/caseControllers");
const {
  nextCase,
  closeDept,
} = require("../controllers/apiControllers/deptControllers");
const Department = require("../models/department");
const Procedure = require("../models/procedure");
const verifyRoles = require("../middleware/verifyRoles");

const router = Router();

// Case Endpoints

router.post("/api/case/newcase", verifyRoles(["FrontDesk"]), createCase);

router.post("/api/case/addvitals", verifyRoles(["Triage"]), triageAdd);

router.post("/api/case/transfercase", verifyRoles("*"), transferCase);

router.post(
  "/api/case/setseverity",
  verifyRoles(["Physician", "Triage"]),
  setSeverity
);

router.post("/api/case/adddiagnosis", verifyRoles(["Physician"]), addDiagnosis);

router.post("/api/case/addtreatment", verifyRoles(["Physician"]), addTreatment);

router.post("/api/case/schedule", verifyRoles("+"), scheduleCase);

router.post("/api/case/close", verifyRoles("+"), closeCase);

router.post("/api/case/recall", verifyRoles("*"), recallCase);

// Department Endpoints

router.post("/api/dept/nextcase", verifyRoles("*"), nextCase);
router.post("/api/dept/close", verifyRoles("*"), closeDept);

// Procedure Endpoints

router.get("/api/prod/get", verifyRoles("*"), async (req, res) => {
  let name = req.query.x;

  if (name) {
    const regex = new RegExp(name, "i");

    let procedure = await Procedure.findOne(
      { name: { $regex: regex } },
      "name"
    );

    if (procedure) {
      res
        .status(200)
        .json({ status: true, message: [procedure.name, procedure._id] });
    } else {
      res.status(200).json({ status: false, message: "" });
    }
  } else {
    res.status(200).json({ status: false, message: "" });
  }
});

module.exports = router;
