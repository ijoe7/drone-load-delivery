const express = require("express");
const router = express.Router();
const droneController = require("../controllers/droneController");

router.post("/registerMultipleDrones", droneController.registerMultipleDrones);
router.post("/registerDrone", droneController.registerDrone);
router.get("/getDrone/:serial_number", droneController.getDrone);
router.get("/getAllDrones", droneController.getAllDrones);
router.get("/getAvailableDrones", droneController.getAvailableDrones);
router.put("/loadingADrone", droneController.loadingADrone);
router.put("/unloadingADrone", droneController.unloadingADrone);
router.put("/unloadingDeliveredLoad", droneController.unloadingDeliveredLoadDrone);
router.get("/periodicDroneBatteryCheck", droneController.periodicDroneBatteryCheck);
router.put("/updateDroneInfo/:serial_number", droneController.updatingDroneInfo);
router.delete("/deleteDrone/:serial_number", droneController.deleteDrone);

module.exports = router;