const Drone = require("../model/drone");
const Load = require("../model/load");
const helper = require("../config/helper");
const path = require("path");
const fs = require("fs");

exports.periodicDroneBatteryCheck = async (req, res, next) => {
    try {
        let drones = await Drone.findAll();
        let currentDate = new Date();
        let newData = {
            date: currentDate,
            drones
        };
        let filePath = path.join(__dirname + "/" + "../data/audit_event_log.json");
        let fileExists = fs.existsSync(filePath);
        if (!fileExists) {
            let newDataArray = [newData];
            let writeToJSONFile = JSON.stringify(newDataArray);
            fs.writeFile(filePath, writeToJSONFile, (err) => {
                if (err) throw err;
                console.log("File created!");
            });
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                let dataArray = JSON.parse(data);
                dataArray.push(newData);
                let writeToJSONFile = JSON.stringify(dataArray);
                fs.writeFile(filePath, writeToJSONFile, (err) => {
                    if (err) throw err;
                    console.log("File updated!");
                });
            });
        }
    } catch (err) {
        console.log(err);
    }
};