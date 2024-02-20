const { Schema, model, Types } = require("mongoose");

const caseSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    patientName: {
      type: String,
      required: true,
    },
    severity: {
      type: Number,
      required: true,
    },
    diagnosis: [
      {
        body: String,
        staff: { type: Schema.Types.ObjectId, ref: "Staff" },
        date: Number,
      },
    ],
    vitals: [
      {
        temperature: String,
        bloodPressure: String,
        date: Number,
      },
    ],
    treatmentPlan: [
      {
        procedure: { type: Schema.Types.ObjectId, ref: "Procedure" },
        id: Number,
        active: {
          type: Boolean,
        }, // The procedure is being actively handled or not
        open: {
          type: Boolean,
        }, // The procedure is still live or closed
        scheduled: {
          type: Boolean,
        }, // The procedure is scheduled for later or not
        instances: [Number],
        objective: {
          type: String,
        },
        documentation: [
          {
            text: String,
            date: Number,
            staff: { type: Schema.Types.ObjectId, ref: "Staff" },
          },
        ],
      },
    ],
    addedOn: Number,
    queued: {
      type: Boolean,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

caseSchema.methods.setSeverity = function (val) {
  let value = val <= 3 ? Number(val) : 3;
  this.severity = value;
  this.save();
};

caseSchema.methods.addDiagnosis = function (body, staffId) {
  staffId = Types.ObjectId(staffId);

  this.diagnosis.push({
    body,
    staff: staffId,
    date: Date.now(),
  });

  this.save();
};

caseSchema.methods.addVitals = function (temp, pressure) {
  this.vitals.push({
    temperature: temp,
    bloodPressure: pressure,
    time: Date.now(),
  });

  this.save();
};

caseSchema.methods.addTreatment = function (prod, objective) {
  let procedure = Types.ObjectId(prod);
  let id = this.treatmentPlan.length + 1;

  this.treatmentPlan.push({
    procedure,
    id,
    objective,
    active: false,
    open: true,
    scheduled: false,
    instances: [],
    documentation: [],
  });

  this.save();
};

caseSchema.methods.closeCase = function () {
  this.open = false;
  this.save();
};

caseSchema.methods.queueCase = function () {
  this.queued = true;
  this.save();
};

caseSchema.methods.closeProcedure = function (prodId) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    this.treatmentPlan[prodIdx].open = false;
    this.save();
  }
};

caseSchema.methods.scheduleProcedure = function (prodId) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    let value = this.treatmentPlan[prodIdx].scheduled;
    this.treatmentPlan[prodIdx].scheduled = !value;
    this.save();
  }
};

caseSchema.methods.activateProcedure = function (prodId) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    let value = this.treatmentPlan[prodIdx].active;
    this.treatmentPlan[prodIdx].active = !value;
    this.save();
  }
};

// Create AutoIncrement Id for Case schema
caseSchema.pre("save", async function (next) {
  let doc = this;

  if (doc.isNew) {
    try {
      docCount = await doc.constructor.countDocuments({});
      doc._id = docCount + 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = model("Case", caseSchema);
