// Initialize dependencies
const express = require("express"); // Express Framework
const cors = require("cors"); // Cross Origin Capabilities
const corsOptions = require("./utils/corsOptions"); // CORS options
const session = require("express-session"); // Session management
const setUser = require("./middleware/setUser"); // Add current user to the request
const authRoutes = require("./routes/authRoutes"); // Connect authentication routes
const dashboardRoutes = require("./routes/dashboardRoutes"); // Connect dashboarb routes
const apiRoutes = require("./routes/apiRoutes");
const path = require("path"); // Path library for building paths
const mongoose = require("mongoose"); // Mongoose Library
const mongoDBStore = require("connect-mongodb-session")(session); // Storing session in mongodb database
const socketIO = require("socket.io"); // SocketIO library for realtime connection
const { createServer } = require("http"); // Create Server from http library
const Department = require("./models/department");
const Procedure = require("./models/procedure");
const Case = require("./models/case");
const Staff = require("./models/staff");
const Message = require("./models/message");
const Session = require("./models/session");

// DB URI
const dbURI = "mongodb://localhost:27017/hwms";
// "mongodb://127.0.0.1:27017/hwms";

// Create Express  app and a server
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
  saveUninitialized: false,
  cookie: {
    // maxAge: 1000 * 60 * 20,
  },
  store: sessionStore,
  rolling: true,
});
app.use(sessionMiddleware, (req, res, next) => {
  req.session.lastAccess = Date.now();
  next();
});

// Create and configure socket.io server
const IO = socketIO(server); //creating the websocket server with the app server
IO.engine.use(sessionMiddleware); // IO to session handshake
require("./utils/socket").serverConfig(IO); //pass the IO conn to its controller
app.use((req, res, next) => {
  req.IO = IO;
  next();
}); //attach the IO conn to request

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

// Define route middlewares here

app.use(authRoutes);

app.use(dashboardRoutes);

app.use(apiRoutes);

// Testing Routes
app.get("/test/latmet/:val", async (req, res) => {
  let deptName = req.params.val;

  let dpt = await Department.findOne({ name: deptName });
  let latmet = await dpt.latencyMetric();
  console.log(latmet);
  res.send("Ok");
});

let testfunc1 = require("./logic/routingModule");
app.get("/test/route/", async (req, res) => {
  let result = await testfunc1(2);
  res.json({ data: result });
});

//connect to DB and set up server
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((conn) => {
    // Start the server
    server.listen(process.env.PORT || 3000, () => {
      console.log("Server is Live !!");
    });
  });
