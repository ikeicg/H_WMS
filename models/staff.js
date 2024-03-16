const mongoose = require("mongoose");
const Department = require("./department");

const staffSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// staffSchema.methods.addMe = async function () {
//   await Department.updateOne(
//     { _id: this.departmentId },
//     { $push: { staffId: this._id } }
//   );
// };

module.exports = mongoose.model("Staff", staffSchema);
