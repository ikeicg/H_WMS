const express = require("express");
const {
  postUserLogin,
  getUserLogin,
  getUserLogout,
} = require("../controllers/authControllers");

// Create the Router
const router = express.Router();

// Define routes here

// Home Page Route
router.get("/", getUserLogin);

// Submit Login Route
router.post("/login", postUserLogin);

// get Logout Route
router.get("/logout", getUserLogout);

// Export the router
module.exports = router;
