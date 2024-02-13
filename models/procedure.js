const { Schema, model } = require("mongoose");

const procedureSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Procedure", procedureSchema);
