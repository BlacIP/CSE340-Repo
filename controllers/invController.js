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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
    classificationSelect
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id) 
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id } = req.body
  const deleteResult = await invModel.deleteInventoryItem(parseInt(inv_id))

  if (deleteResult.rowCount) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).redirect(`/inv/delete/${inv_id}`)
  }
}

/* ***************************
 *  Build approval view
 * ************************** */
invCont.buildApprovalView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getUnapprovedClassifications()
  const inventory = await invModel.getUnapprovedInventory()
  res.render("inventory/approval", {
    title: "Approve Items",
    nav,
    message: req.flash("notice"),
    classifications,
    inventory,
    errors: null
  })
}

/* ***************************
 *  Approve classification
 * ************************** */
invCont.approveClassification = async function (req, res, next) {
  const classification_id = req.body.classification_id
  const account_id = res.locals.account.account_id
  const result = await invModel.approveClassification(classification_id, account_id)
  if (result) {
    req.flash("notice", "Classification approved successfully.")
  } else {
    req.flash("notice", "Classification approval failed.")
  }
  res.redirect("/inv/approval")
}

/* ***************************
 *  Approve inventory
 * ************************** */
invCont.approveInventory = async function (req, res, next) {
  const inv_id = req.body.inv_id
  const account_id = res.locals.account.account_id
  const result = await invModel.approveInventory(inv_id, account_id)
  if (result) {
    req.flash("notice", "Inventory item approved successfully.")
  } else {
    req.flash("notice", "Inventory item approval failed.")
  }
  res.redirect("/inv/approval")
}

/* ***************************
 *  Reject classification
 * ************************** */
invCont.rejectClassification = async function (req, res, next) {
  const classification_id = req.body.classification_id
  
  // Check if there are any unapproved inventory items using this classification
  const inventoryUsingClassification = await invModel.getUnapprovedInventoryByClassificationId(classification_id)
  
  if (inventoryUsingClassification.length > 0) {
    req.flash("notice", "Classification cannot be rejected as it is referenced by unapproved inventory items. Please update those items first.")
    return res.redirect("/inv/approval")
  }
  
  const result = await invModel.deleteClassification(classification_id)
  if (result && result.rowCount) {
    req.flash("notice", "Classification rejected and deleted successfully.")
  } else {
    req.flash("notice", "Classification rejection failed.")
  }
  res.redirect("/inv/approval")
}


/* ***************************
 *  Reject inventory
 * ************************** */
invCont.rejectInventory = async function (req, res, next) {
  const inv_id = req.body.inv_id
  const result = await invModel.deleteInventoryItem(inv_id)
  if (result && result.rowCount) {
    req.flash("notice", "Inventory item rejected and deleted successfully.")
  } else {
    req.flash("notice", "Inventory item rejection failed.")
  }
  res.redirect("/inv/approval")
}




module.exports = invCont