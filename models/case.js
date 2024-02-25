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
      },
    ],
    treatmentPlan: [
      {
        procedure: { type: Schema.Types.ObjectId, ref: "Procedure" },
        id: Number,
        open: {
          type: Boolean,
        }, // The procedure is still live or closed
        scheduled: {
          type: Boolean,
        }, // The procedure is scheduled for later or not
        scheduledDate: Number,
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
    createdOn: Number,
    queued: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
    }, // The case is being actively handled or not
    open: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

caseSchema.methods.setSeverity = async function (val) {
  let value = val <= 3 ? Number(val) : 3;
  this.severity = value;
  await this.save();
};

caseSchema.methods.addDiagnosis = async function (body, staffId) {
  staffId = new Types.ObjectId(staffId);

  this.diagnosis.push({
    body,
    staff: staffId,
    date: Date.now(),
  });

  await this.save();
};

caseSchema.methods.addVitals = async function (temp, pressure) {
  this.vitals.push({
    temperature: temp,
    bloodPressure: pressure,
    time: Date.now(),
  });

  await this.save();
};

caseSchema.methods.addTreatment = async function (prodId, objective) {
  let procedure = new Types.ObjectId(prodId);
  let id = this.treatmentPlan.length + 1;

  this.treatmentPlan.push({
    procedure,
    id,
    objective,
    open: true,
    scheduled: false,
    instances: [],
    documentation: [],
  });

  await this.save();
};

caseSchema.methods.closeCase = function () {
  this.open = false;
  this.save();
};

caseSchema.methods.queueCase = function () {
  this.queued = true;
  this.save();
};

caseSchema.methods.closeProcedure = async function (prodId) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    let value = this.treatmentPlan[prodIdx].open;
    this.treatmentPlan[prodIdx].open = !value;
    await this.save();
  }
};

caseSchema.methods.scheduleProcedure = async function (prodId, date) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    let value = this.treatmentPlan[prodIdx].scheduled;
    this.treatmentPlan[prodIdx].scheduled = !value;
    this.treatmentPlan[prodIdx].scheduledDate = date;
    await this.save();
  }
};

caseSchema.methods.documentProcedure = async function (prodId, staffId, text) {
  let prodIdx = this.treatmentPlan.findIndex((obj) => obj.id == prodId);

  if (prodIdx != -1) {
    this.treatmentPlan[prodIdx].documentation.push({
      text,
      staffId: new Types.ObjectId(staffId),
      date: Date.now(),
    });
    await this.save();
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
