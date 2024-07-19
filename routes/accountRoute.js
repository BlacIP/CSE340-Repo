const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

// Add a "GET" route for the login path
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

// Add a "GET" route for the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to update account information view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Route to process account information update
router.post("/update", 
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount))

// Route to process password change
router.post("/change-password",
  utilities.checkLogin,
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword))


// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router;