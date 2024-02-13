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
    staffId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
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
    const caseIndex = this.cases.findIndex((x) => x == caseId);

    if (caseIndex !== -1) {
      await this.constructor
        .updateOne({ name: this.name }, { $pull: { cases: caseId } })
        .then();
      await this.constructor.updateOne(
        { name: dept },
        { $push: { cases: caseId } }
      );
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
      let caze = await Case.findOne({ _id: val }, "treatment").populate({
        path: "treatment.procedure",
        populate: {
          path: departmentSchema,
          select: "name",
        },
        select: "duration",
      });

      let prods = caze.treatmentPlan.filter(
        (prod) => prod.department.name == this.name
      );

      prods.forEach((item) => {
        latMet += Number(item.duration);
      });
    }
  }

  return latMet;
};

module.exports = mongoose.model("Department", departmentSchema);
