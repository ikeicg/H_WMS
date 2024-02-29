const mongoose = require("mongoose");
const Case = require("../models/case");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    cases: {
      type: [{ type: Number, ref: "Case" }],
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.methods.transferCase = async function (caseId, dept) {
  try {
    // Find the case in the cases field
    const caseIndex = this.cases.findIndex((x) => x == caseId);

    if (caseIndex !== -1) {
      // remove the case from the initial department
      await this.constructor
        .updateOne({ name: this.name }, { $pull: { cases: caseId } })
        .then();

      // Update the case's fields
      let caze = await Case.findOne({ _id: caseId }, "addedOn active queued");
      caze.addedOn = Date.now();
      caze.active = false;
      caze.queued = true;
      await caze.save();

      // add the case to the target department
      await this.constructor.updateOne(
        { name: dept },
        { $push: { cases: caseId } }
      );

      return { status: true, message: "Successfully transferred case" };
    } else {
      return {
        status: false,
        message: "Case doesn't belong in this department",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error encountered while transferring case",
    };
  }
};

departmentSchema.methods.latencyMetric = async function () {
  let latMet = 0;

  if (this.cases.length >= 1) {
    for (const val of this.cases) {
      let caze = await Case.findOne(
        { _id: val },
        "active treatmentPlan.procedure, treatmentPlan.active"
      ).populate({
        path: "treatmentPlan.procedure",
        populate: {
          path: "department",
          model: "Department",
          select: "name",
        },
        select: "duration",
      });

      if (!caze.active) {
        let prods = caze.treatmentPlan.filter(
          (prod) => prod.procedure.department.name == this.name
        );

        prods.forEach((item) => {
          latMet += Number(item.procedure.duration);
        });
      }
    }
  }

  return latMet;
};

departmentSchema.methods.nextCase = async function () {
  let cases = [];
  for (let x of this.cases) {
    let caze = await Case.findOne({ _id: x }).populate([
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
    ]);

    cases.push(caze);
  }

  cases = cases.filter((x) => x.active != true);

  if (cases.length > 0) {
    cases.sort((a, b) => {
      if (a.severity > b.severity) return -1;
      if (a.severity < b.severity) return 1;

      return a.addedOn - b.addedOn;
    });

    let nextCase = cases[0];
    nextCase.active = true;
    await nextCase.save();

    return nextCase;
  } else {
    return 0;
  }
};

departmentSchema.methods.closeDepartment = async function () {
  try {
    this.open = false;
    await this.save();
    return { status: true, message: "Successful" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Failure" };
  }
};

departmentSchema.methods.openDepartment = async function () {
  try {
    this.open = true;
    await this.save();
    return { status: true, message: "Sucessful" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Failure" };
  }
};

module.exports = mongoose.model("Department", departmentSchema);
