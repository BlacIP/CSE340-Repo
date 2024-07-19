const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const message = req.flash("notice")
  res.render("index", {title: "Home", nav, message})
}

module.exports = baseController