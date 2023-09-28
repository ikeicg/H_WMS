// Initialize dependencies
const express = require("express");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");

// Create Express server
const app = express();

// Configure cors middleware
app.use(cors(corsOptions));

// Set EJS and views as view engine and views folder respectively
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Define routes here
app.get("/", (req, res) => {
  res.render("login");
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Live!!");
});
