const getDashboard = (req, res) => {
  const path = req.query.path || null;
  res.render("dashboard", { path: path, user: req.user });
};

module.exports = {
  getDashboard,
};
