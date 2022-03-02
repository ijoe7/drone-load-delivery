const Drone = require("../model/drone");
const Load = require("../model/load");
const helper = require("../config/helper");
const fs = require("fs");
const path = require("path");

exports.registerDrone = async (req, res, next) => {
    try {
        let request = ["battery_percentage", "model"];
        let data = helper.validateParams(req, next, request);
        let allDrones = await Drone.findAll();
        if (allDrones.length >= 10) return res.status(400).json({ message: "Max 10 drones allowed" });
        let serial_number = helper.generateUniqueCode(20);
        data.serial_number = serial_number;
        let drone = await Drone.create(data);
        res.status(201).json({
            status: "success",
            message: "Drone registered successfully",
            data: drone
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.registerMultipleDrones = async (req, res, next) => {
    try {
        let rawData = fs.readFileSync(path.join(__dirname + "/" + "../data/droneData.json"));
        let data = JSON.parse(rawData);
        for (let i = 0; i < data.length; i++) {
            allDrones = await Drone.findAll();
            if (allDrones.length >= 10) {
                return res.status(400).json({
                    message: "Max 10 drones reached",
                    data: allDrones
                });
            }
                let serial_number = helper.generateUniqueCode(20);
                data[i].serial_number = serial_number;
                await Drone.create(data[i]);
        }
        let drone = await Drone.findAll();
        res.status(201).json({
            status: "success",
            message: "Drone registered successfully",
            data: drone
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.getDrone = async (req, res, next) => {
    try {
        let request = ["serial_number"];
        let data = helper.validateParams(req, next, request);
        let drone = await Drone.findOne({ where: { serial_number: data.serial_number } });
        if (!drone) return res.status(400).json({ message: "Drone not found" });
        let droneData = await Drone.findByPk(drone.id, {
            include: ["loads"]
        });
        res.status(200).json({
            status: "success",
            message: "Drone found successfully",
            data: droneData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.getAllDrones = async (req, res, next) => {
    try {
        let allDrones = await Drone.findAll({
            include: ["loads"]
        });
        res.status(200).json({
            status: "success",
            message: "Drones found successfully",
            data: allDrones
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.getAvailableDrones = async (req, res, next) => {
    try {
        let allDrones = await Drone.findAll({
            where: { status: "idle" }
        });
        res.status(200).json({
            status: "success",
            message: "Drones found successfully",
            data: allDrones
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.loadingADrone = async (req, res, next) => {
    try {
        let request = ["serial_number", "code"];
        let data = helper.validateParams(req, next, request);
        let drone = await Drone.findOne({ where: { serial_number: data.serial_number } });
        if (!drone) return res.status(400).json({ message: "Drone not found" });
        let load = await Load.findOne({ where: { code: data.code } });
        if (!load) return res.status(400).json({ message: "Load not found" });
        // Check if drone is idle or is already loading
        if (drone.status !== "idle" || drone.status !== "loading") return res.status(400).json({ message: "Drone is not idle or loading" });
        // Check drone battery percentage
        if (drone.battery_percentage < 25) {
            drone.status = "idle";
            await drone.save();
            return res.status(400).json({ message: "Drone battery is low" });
        }
        // Check weight limit
        let newWeight = drone.weight_gr + load.weight_gr;
        if (newWeight > 500) {
            return res.status(400).json({
                message: "Drone weight is too heavy",
                data: drone
            });
        }
        // Update Load
        load.status = "loaded";
        load.droneId = drone.id;
        await load.save();
        // Update Drone
        drone.weight_gr = newWeight;
        drone.status = "loading";
        await drone.save();
        let droneData = await Drone.findByPk(drone.id, {
            include: ["loads"]
        });
        res.status(201).json({
            status: "success",
            message: "Drone loaded successfully",
            data: droneData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.unloadingADrone = async (req, res, next) => {
    try {
        let request = ["serial_number", "code"];
        let data = helper.validateParams(req, next, request);
        let drone = await Drone.findOne({ where: { serial_number: data.serial_number } });
        if (!drone) return res.status(400).json({ message: "Drone not found" });
        let load = await Load.findOne({ where: { code: data.code } });
        if (!load) return res.status(400).json({ message: "Load not found" });
        if (drone.status !== "loading") return res.status(400).json({ message: "Drone is not loading" });
        // Reduce weight
        let newWeight = drone.weight_gr - load.weight_gr;
        // Update Load
        load.status = "pending";
        load.droneId = null;
        await load.save();
        // Update Drone
        drone.weight_gr = newWeight;
        await drone.save();
        let droneData = await Drone.findByPk(drone.id, {
            include: ["loads"]
        });
        res.status(201).json({
            status: "success",
            message: "Drone unloaded successfully",
            data: droneData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

exports.unloadingDeliveredLoadDrone = async (req, res, next) => {
    try {
        let request = ["serial_number", "code"];
        let data = helper.validateParams(req, next, request);
        let drone = await Drone.findOne({ where: { serial_number: data.serial_number } });
        if (!drone) return res.status(400).json({ message: "Drone not found" });
        let load = await Load.findOne({ where: { code: data.code } });
        if (!load) return res.status(400).json({ message: "Load not found" });
        if (drone.status !== "loading") return res.status(400).json({ message: "Drone is not loading" });
        // Reduce weight
        let newWeight = drone.weight_gr - load.weight_gr;
        // Update Load
        load.status = "delivered";
        load.droneId = null;
        await load.save();
        // Update Drone
        drone.weight_gr = newWeight;
        await drone.save();
        let droneData = await Drone.findByPk(drone.id, {
            include: ["loads"]
        });
        res.status(201).json({
            status: "success",
            message: "Drone unloaded successfully",
            data: droneData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.periodicDroneBatteryCheck = async (req, res, next) => {
    try {
        let drones = await Drone.findAll();
        let currentDate = new Date();
        let newData = {
            date: currentDate,
            drones,
        };
        let filePath = path.join(__dirname + "/" + "../data/audit_event_log.json");
        let fileExists = fs.existsSync(filePath);
        console.log(fileExists);
        if (!fileExists) {
            let newDataArray = [newData];
            let writeToJSONFile = JSON.stringify(newDataArray);
            fs.writeFile(filePath, writeToJSONFile, (err) => {
                if (err) throw err;
                console.log("File created!");
                return res.status(201).json({
                    status: "success",
                    message: "File created successfully",
                    data: newData
                });
            });
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                let dataArray = JSON.parse(data);
                console.log(dataArray);
                dataArray.push(newData);
                console.log(dataArray);
                let writeToJSONFile = JSON.stringify(dataArray);
                fs.writeFile(filePath, writeToJSONFile, (err) => {
                    if (err) throw err;
                    console.log("File updated!");
                    return res.status(201).json({
                        status: "success",
                        message: "Drone battery check completed successfully and recorded in audit log",
                        data: drones
                    })
                });
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.updatingDroneInfo = async (req, res, next) => {
    try {
        const { serial_number } = req.params;
        if (!serial_number) return res.status(400).json({ message: "Serial number is required" });
        let request = ["battery_percentage", "status"];
        let data = helper.validateParams(req, next, request);
        let drone = await Drone.findOne({ where: { serial_number: serial_number } });
        if (!drone) return res.status(400).json({ message: "Drone not found" });
        drone.battery_percentage = data.battery_percentage || drone.battery_percentage;
        drone.status = data.status || drone.status;
        await drone.save();
        let droneData = await Drone.findByPk(drone.id, {
            include: ["loads"]
        });
        res.status(201).json({
            status: "success",
            message: "Drone info updated successfully",
            data: droneData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

