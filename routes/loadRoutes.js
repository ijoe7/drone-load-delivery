const express = require("express");
const router = express.Router();
const loadController = require("../controllers/loadController");

router.post("/registerLoad", loadController.registerLoad);
router.get("/getLoadByCode/:code", loadController.getLoadByCode);
router.get("/getAllLoads", loadController.getAllLoads);
router.put("/updateLoadWeight/:code", loadController.updateLoadWeight);
router.delete("/deleteLoad/:code", loadController.deleteLoad);

module.exports = router;
