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

      // add the case to the target department
      await this.constructor.updateOne(
        { name: dept },
        { $push: { cases: caseId } }
      );

      // Update the case's fields
      let caze = await Case.findOne({ _id: caseId }, "addedOn queued");
      caze.addedOn = Date.now();
      caze.queued = true;
      await caze.save();

      return { success: true, message: "Successfully transferred case" };
    } else {
      return {
        success: false,
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
        "treatmentPlan.procedure, treatmentPlan.active"
      ).populate({
        path: "treatmentPlan.procedure",
        populate: {
          path: "department",
          model: "Department",
          select: "name",
        },
        select: "duration",
      });

      let prods = caze.treatmentPlan.filter(
        (prod) =>
          prod.procedure.department.name == this.name && prod.active == false
      );

      prods.forEach((item) => {
        latMet += Number(item.procedure.duration);
      });
    }
  }

  return latMet;
};

departmentSchema.methods.closeDepartment = async function () {};

departmentSchema.methods.openDepartment = async function () {};

module.exports = mongoose.model("Department", departmentSchema);
