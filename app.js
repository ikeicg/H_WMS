// Initialize dependencies
const express = require("express"); //Express Framework
const cors = require("cors"); //Cross Origin Capabilities
const corsOptions = require("./utils/corsOptions"); //CORS options
const session = require("express-session"); //Session management
const Staff = require("./models/staff");
const setUser = require("./middleware/setUser");
const isAuth = require("./utils/isAuth");
const path = require("path");
const mongoose = require("mongoose");
const mongoDBStore = require("connect-mongodb-session")(session);
const socketIO = require("socket.io");
const socketMod = require("./utils/socket");
const { createServer } = require("http");

// DB URI
const dbURI = "mongodb://127.0.0.1:27017/hwms";

// Create Express server

const app = express();
const server = createServer(app);

// Configure cors middleware
app.use(cors(corsOptions));

// Configure session store
const sessionStore = new mongoDBStore({
  uri: dbURI,
  collection: "sessions",
});

// Configure session
const sessionMiddleware = session({
  secret: "mysecretkey",
  resave: false,
  saveUnitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 5,
  },
  store: sessionStore,
});
app.use(sessionMiddleware);

// Create and configure socket.io server
const IO = socketIO(server); //creating the server
IO.engine.use(sessionMiddleware); //linking to the session
require("./utils/socket")(IO); //pass the IO conn to its controller
app.use((req, res, next) => {
  req.IO = IO;
  next();
}); //attach the IO conn to each request

// Set EJS as view engine
app.set("view engine", "ejs");

// Configure Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS and views as view engine and views folder respectively
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//configure static folder
app.use(express.static(path.join(__dirname, "public")));

// Set User
app.use(setUser);

// Define routes here

// Home route
app.get("/", (req, res) => {
  res.render("login");
});

// Login route
app.post("/login", (req, res) => {
  Staff.findOne({ employeeId: req.body.employee_id }).then((staffer) => {
    if (staffer) {
      if (staffer.password == req.body.passwd) {
        req.session.user = { id: staffer._id, role: staffer.role };
        res.status(200).redirect("/dashboard");
      } else {
        res.status(400).redirect("/"); //Invalid Password
      }
    } else {
      res.status(400).redirect("/"); //Invalid Username
    }
  });
});

app.get("/dashboard", isAuth, (req, res) => {
  const path = req.query.path || null;
  res.render("dashboard", { path: path, user: req.user });
});

//connect to DB and set up server
mongoose.connect(dbURI).then(async (conn) => {
  // Start the server
  server.listen(process.env.PORT || 3000, () => {
    console.log("Server is Live !!");
  });
});
