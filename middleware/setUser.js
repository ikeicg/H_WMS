const Staff = require("../models/staff");
module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    Staff.findById(req.session.user.id, "firstname lastname role").then(
      (staffer) => {
        req.user = staffer;
        next();
      }
    );
  }
};
