const express = require("express");
const isAuth = require("../utils/isAuth");
const { getDashboard } = require("../controllers/dashboardControllers");

const router = express.Router();

router.get("/dashboard", isAuth, getDashboard);

module.exports = router;
