const _ = require("underscore");

exports.testDB = async (db) => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

exports.generateUniqueCode = (size = 6, alpha = true) => {
  let characters = alpha
    ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    : "0123456789";
  characters = characters.split("");
  let selections = "";
  for (let i = 0; i < size; i++) {
    let index = Math.floor(Math.random() * characters.length);
    selections += characters[index];
    characters.splice(index, 1);
  }
  return selections;
};

exports.validateParams = (req, next, request) => {
  request.map((item) => {
    if (!req.body[item]) throw new Error(`${item} is required`);
  });
  let data = _.pick(req.body, request);
  return data;
};