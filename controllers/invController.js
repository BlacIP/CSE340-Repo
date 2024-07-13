const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventoryId = req.params.inventoryId;
    const data = await invModel.getInventoryByInventoryId(inventoryId);
    const detailViewHtml = utilities.buildInventoryDetailView(data);
    let nav = await utilities.getNav()
    res.render('./inventory/details', {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      content: detailViewHtml,
    })
};

// New method for building management view
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice")
  })
}

// New methods for adding classification
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash("notice", `Successfully added ${classification_name} classification.`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }]
    })
  }
}

// New methods for adding inventory
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: req.body.inv_make || "",
    inv_model: req.body.inv_model || "",
    inv_year: req.body.inv_year || "",
    inv_description: req.body.inv_description || "",
    inv_image: req.body.inv_image || "",
    inv_thumbnail: req.body.inv_thumbnail || "",
    inv_price: req.body.inv_price || "",
    inv_miles: req.body.inv_miles || "",
    inv_color: req.body.inv_color || ""
  })
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body

  const addResult = await invModel.addInventory({
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  })

  if (addResult) {
    req.flash("notice", `Successfully added ${inv_make} ${inv_model} to inventory.`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Failed to add inventory item.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add inventory item." }],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}




module.exports = invCont