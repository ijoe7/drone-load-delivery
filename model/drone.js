const Sequelize = require("sequelize");
const db = require("../config/database");
// const Comment = require("./comment");

const Drone = db.define("drone", {
    serial_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    model: {
        type: Sequelize.ENUM("lightweight", "middleweight", "cruiserweight", "heavyweight"),
        allowNull: false,
    },
    weight_gr: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        max: 500,
    },
    battery_percentage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        max: 100,
    },
    status: {
        type: Sequelize.ENUM("idle", "loading", "loaded", "delivering", "delivered", "returning"),
        defaultValue: "idle",
    },
});

module.exports = Drone;
