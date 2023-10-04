// Initialize dependencies
const express = require("express");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const session = require("express-session");
const users = require("./db/Users");
const isAuth = require("./utils/isAuth");

// Create Express server
const app = express();

// Configure cors middleware
app.use(cors(corsOptions));

// Configure session
sessionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUnitialised: false,
  cookie: {
    maxAge: 1000 * 60 * 5,
  },
};

app.use(session(sessionOptions));

// Set EJS as view engine
app.set("view engine", "ejs");

// Configure Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS and views as view engine and views folder respectively
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Define routes here

//Home route
app.get("/", (req, res) => {
  res.render("login");
});

//Login route
app.post("/login", (req, res) => {
  const user = users.find((x) => x.name == req.body.userrname);

  if (user) {
    if (user.password == req.body.passwd) {
      req.session.user = user;
      console.log(user, "logged in");
      res.status(200).redirect("/dashboard");
    } else {
      res.status(401).redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard", { username: req.session.user.name });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Live!!");
});
