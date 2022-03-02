const Load = require("../model/load");
const Drone = require("../model/drone");
const helper = require("../config/helper");

exports.registerLoad = async (req, res, next) => {
    try {
        let request = ["name", "weight_gr"];
        let data = helper.validateParams(req, next, request);
        // change name to lowercase
        data.name = data.name.toLowerCase();
        // Generate load code
        let generateCode = helper.generateUniqueCode(5, false);
        let codeExists = await Load.findOne({ where: { code: generateCode } });
        while (codeExists) {
            generateCode = helper.generateUniqueCode(5, false);
            codeExists = await Load.findOne({ where: { code: generateCode } });
        }
        let code = `${data.name.toUpperCase()}_${generateCode}`;
        data.code = code;
        let load = await Load.create(data);
        res.status(201).json({
        status: "success",
        message: "Load registered successfully",
        data: load
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};


exports.getLoadByCode = async (req, res, next) => {
    try {
        let { code } = req.params;
        if (!code) return res.status(400).json({ message: "Code is required" });
        let load = await Load.findOne({ where: { code: code } });
        res.status(200).json({
            status: "success",
            message: "Load retrieved successfully",
            data: load
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.getAllLoads = async (req, res, next) => {
    try {
        let loads = await Load.findAll();
        if (!loads) return res.status(400).json({ message: "Loads not found" });
        res.status(200).json({
            status: "success",
            message: "Loads retrieved successfully",
            data: loads
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.updateLoadWeight = async (req, res, next) => {
    try {
        let { code } = req.params;
        if (!code) return res.status(400).json({ message: "Code is required" });
        let load = await Load.findOne({ where: { code: code } });
        if (!load) return res.status(400).json({ message: "Load not found" });
        if (load.droneId) return res.status(400).json({ message: "Load is already loaded. It cannot be updated" });
        const { weight_gr } = req.body;
        load.update({
            weight_gr: weight_gr || load.weight_gr
        });
        res.status(200).json({
            status: "success",
            message: "Load updated successfully",
            data: load
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

exports.deleteLoad = async (req, res, next) => {
    try {
        let { code } = req.params;
        if (!code) return res.status(400).json({ message: "Code is required" });
        let load = await Load.findOne({ where: { code: code } });
        if (!load) return res.status(400).json({ message: "Load not found" });
        if (load.droneId) return res.status(400).json({ message: "Load is already loaded. It cannot be deleted" });
        load.destroy();
        res.status(200).json({
            status: "success",
            message: "Load deleted successfully",
            data: load
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}