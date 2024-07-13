// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to handle add classification form submission
router.post("/add-classification",
  validation.classificationRules(),
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to handle add inventory form submission
router.post("/add-inventory",
  validation.inventoryRules(),
  validation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);


module.exports = router;