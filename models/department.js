const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    cases: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
      required: true,
    },
    staffId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Department", departmentSchema);
