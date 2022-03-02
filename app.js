const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helper = require("./config/helper");
const cors = require("cors");
const path = require("path");
const droneRouter = require("./routes/droneRoutes");
const loadRouter = require("./routes/loadRoutes");
const { periodicDroneBatteryCheck } = require("./controllers/eventLog");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// Database connection
const db = require("./config/database");

// Test DB connection
helper.testDB(db);

// Associate models
const Drone = require("./model/drone");
const Load = require("./model/load");

Drone.hasMany(Load, {
  as: "loads",
});
Load.belongsTo(Drone, {
  foreignKey: "droneId",
  as: "drone",
});

db.sync({
  // alter: true,
  // force: true,
})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

// set interval for periodic drone battery check every 1 hour
setInterval(periodicDroneBatteryCheck, 1000 * 60 * 60);

app.use("/api", droneRouter);
app.use("/api/load", loadRouter);

app.use("/", (req, res) => {
  res.send("Hello, Welcome to the Movie Info API");
});

engines = {
  node: "14.16.0",
  npm: "8.1.0",
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
