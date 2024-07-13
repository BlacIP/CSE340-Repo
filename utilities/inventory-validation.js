const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must not contain spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
      body("inv_make").trim().escape().notEmpty().withMessage("Please provide a make."),
      body("inv_model").trim().escape().notEmpty().withMessage("Please provide a model."),
      body("inv_year").isInt({ min: 1886 }).withMessage("Please provide a valid year."),
      body("inv_description").trim().escape().notEmpty().withMessage("Please provide a description."),
      body("inv_image").trim().escape().notEmpty().withMessage("Please provide an image path."),
      body("inv_thumbnail").trim().escape().notEmpty().withMessage("Please provide a thumbnail path."),
      body("inv_price").isFloat({ min: 0 }).withMessage("Please provide a valid price."),
      body("inv_miles").isInt({ min: 0 }).withMessage("Please provide the miles."),
      body("inv_color").trim().escape().notEmpty().withMessage("Please provide a color."),
      body("classification_id").isInt().withMessage("Please choose a classification.")
    ]
  }
  
  /* ******************************
   * Check data and return errors or continue to registration
   * ***************************** */
  validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(req.body.classification_id)
      res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_year: req.body.inv_year,
        inv_description: req.body.inv_description,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_price: req.body.inv_price,
        inv_miles: req.body.inv_miles,
        inv_color: req.body.inv_color
      })
      return
    }
    next()
  }
  

module.exports = validate
