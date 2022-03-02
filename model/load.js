const Sequelize = require("sequelize");
const db = require("../config/database");
// const Comment = require("./comment");

const Load = db.define("load", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    weight_gr: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM("pending", "loaded", "delivered", "returned"),
        defaultValue: "pending"
    }
});

module.exports = Load;
