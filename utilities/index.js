const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  /* *************
  * Build the html for detai view
  * ************* */

  Util.buildInventoryDetailView = function(data){
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);
    const mileage = new Intl.NumberFormat('en-US').format(data.inv_miles);
  
    return `
    <h1 class="detailtitle">${data.inv_make} ${data.inv_model}</h1>
    <div class="vehicle-detail">
     <div class="vehicle-image">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}"> </div>
      <div class="detaildiv">
      <div class="titlediv">
     
      <p><strong>Year:</strong> ${data.inv_year}</p> 
      <p><strong>Price:</strong> ${price}</p> </div>
      <p><strong>Mileage:</strong> ${mileage} miles</p>
      <p><strong>Description:</strong> ${data.inv_description}</p>
      <p><strong>Color:</strong>  ${data.inv_color}
        <span class="color-box" style="background-color: ${data.inv_color};"></span>
      </p>
      <p><strong>Classification:</strong> ${data.classification_name}</p> </div>
    </div>
  `;
};

/**
 * Build the classification dropdown list
 * @param {number} [selectedId] - Optional ID of the selected classification
 * @returns {Promise<string>} - HTML string for the dropdown list
 */
Util.buildClassificationList = async function (selectedId = null) {
  let data = await invModel.getListClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification &#9662;</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (selectedId != null && row.classification_id == selectedId) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
  

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 * Middleware to check login status
 **************************************** */
Util.checkLoginStatus = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.account = null;
        res.locals.loggedin = false;
        next();
      } else {
        res.locals.account = decodedToken;
        res.locals.loggedin = true;
        next();
      }
    });
  } else {
    res.locals.account = null;
    res.locals.loggedin = false;
    next();
  }
};

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 * Middleware to check account type
 **************************************** */
Util.checkAdminOrEmployee = (req, res, next) => {
  if (res.locals.account && (res.locals.account.account_type === 'Admin' || res.locals.account.account_type === 'Employee')) {
    next();
  } else {
    req.flash("notice", "You do not have the necessary permissions to access this page.");
    return res.redirect("/account/login");
  }
};

module.exports = Util