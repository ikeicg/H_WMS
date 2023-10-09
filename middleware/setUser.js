const Staff = require("../models/staff");
module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    Staff.findById(req.session.user.id).then((staffer) => {
      req.user = staffer;
      next();
    });
  }
};
