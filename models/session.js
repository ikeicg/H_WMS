const mongoose = require("mongoose");

sessionSchema = mongoose.Schema({
  expires: Date,
  session: {
    cookie: {},
    user: {
      id: mongoose.Schema.Types.ObjectId,
      role: String,
    },
  },
});

module.exports = mongoose.model("Session", sessionSchema);
