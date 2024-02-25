module.exports = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (roles === "*") {
      next();
    } else if (roles === "+") {
      if (
        userRole &&
        !["Physician", "Triage", "FrontDesk"].includes(userRole)
      ) {
        next();
      } else {
        res.status(403).json({ error: "Forbidden: Insufficient Permission" });
      }
    } else if (userRole && roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Insufficient Permission" });
    }
  };
};
