const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helper = require("./config/helper");
const cors = require("cors");
const droneRouter = require("./routes/droneRoutes");
const loadRouter = require("./routes/loadRoutes");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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
  // force: false,
})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use("/api", droneRouter);
app.use("/api", loadRouter);

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
