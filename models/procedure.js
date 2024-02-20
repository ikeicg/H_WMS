const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const procedureSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Procedure", procedureSchema);
