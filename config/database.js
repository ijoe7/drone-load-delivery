const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// const db = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

const db = new Sequelize("dronedelivery", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = db;