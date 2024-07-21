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
router.get("/", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildManagementView));

// Route to add classification view (requires Admin or Employee)
router.get("/add-classification", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddClassification));

// Route to handle add classification form submission (requires Admin or Employee)
router.post("/add-classification",
  utilities.checkAdminOrEmployee,
  validation.classificationRules(),
  validation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view (requires Admin or Employee)
router.get("/add-inventory", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddInventory));

// Route to handle add inventory form submission (requires Admin or Employee)
router.post("/add-inventory",
  utilities.checkAdminOrEmployee,
  validation.inventoryRules(),
  validation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory view (requires Admin or Employee)
router.get("/edit/:inventory_id", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildEditInventory))

// Route to handle update inventory form submission (requires Admin or Employee)
router.post("/update",
  utilities.checkAdminOrEmployee,
  validation.inventoryRules(),
  validation.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
)

// Route to handle delete confirmation view (requires Admin or Employee)
router.get("/delete/:inventory_id", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildDeleteConfirmation))

// Route to handle delete inventory form submission (requires Admin or Employee)
router.post("/delete",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventory)
)

// Route to approval view (requires Admin or Employee)
router.get("/approval", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildApprovalView));

// Route to approve classification (requires Admin or Employee)
router.post("/approve-classification", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.approveClassification));

// Route to approve inventory (requires Admin or Employee)
router.post("/approve-inventory", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.approveInventory));

// Route to reject classification (requires Admin or Employee)
router.post("/reject-classification", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.rejectClassification))

// Route to reject inventory (requires Admin or Employee)
router.post("/reject-inventory", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.rejectInventory))



module.exports = router;
