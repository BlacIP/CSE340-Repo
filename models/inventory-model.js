const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification WHERE classification_approved = true ORDER BY classification_name")
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getListClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1 AND i.inv_approved = true`,
      [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  /* **************
  *  Get all inventory items
  * ************** */
  async function getInventoryByInventoryId(inv_id) {
    try {
      const query = `
        SELECT i.*, c.classification_name 
        FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`;
      const values = [inv_id];
      const data = await pool.query(query, values);
      return data.rows[0]; // Return single object instead of array
    } catch (error) {
      console.error("getInventoryByInventoryId error " + error);
    }
  }

  // New function for adding classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("addClassification error " + error)
  }
}

// New function for adding inventory
async function addInventory(inventory) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`
    const values = [
      inventory.classification_id, inventory.inv_make, inventory.inv_model, inventory.inv_year,
      inventory.inv_description, inventory.inv_image, inventory.inv_thumbnail,
      inventory.inv_price, inventory.inv_miles, inventory.inv_color
    ]
    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("addInventory error " + error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Classification
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    const sql = 'DELETE FROM public.classification WHERE classification_id = $1 RETURNING *'
    const data = await pool.query(sql, [classification_id])
    return data
  } catch (error) {
    new Error("Delete Classification Error")
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* *****************************
 *  Get unapproved classifications
 * *************************** */
async function getUnapprovedClassifications() {
  try {
    const sql = "SELECT * FROM classification WHERE classification_approved = false"
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getUnapprovedClassifications error: " + error)
    return []
  }
}

/* ***************************
 *  Get unapproved inventory items
 * ************************** */
async function getUnapprovedInventory() {
  try {
    const query = `
      SELECT i.*, c.classification_name 
      FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_approved = false`;
    const data = await pool.query(query);
    return data.rows;
  } catch (error) {
    console.error("getUnapprovedInventory error " + error);
  }
}

/* *****************************
 *  Approve classification
 * *************************** */
async function approveClassification(classification_id, account_id) {
  try {
    const sql = `UPDATE classification 
                 SET classification_approved = true, account_id = $2, classification_approval_date = CURRENT_TIMESTAMP 
                 WHERE classification_id = $1 RETURNING *`
    const data = await pool.query(sql, [classification_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("approveClassification error: " + error)
    return null
  }
}

/* *****************************
 *  Approve inventory item
 * *************************** */
async function approveInventory(inv_id, account_id) {
  try {
    const sql = `UPDATE inventory 
                 SET inv_approved = true, account_id = $2, inv_approved_date = CURRENT_TIMESTAMP 
                 WHERE inv_id = $1 RETURNING *`
    const data = await pool.query(sql, [inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("approveInventory error: " + error)
    return null
  }
}


/* ***************************
 *  Get unapproved inventory items by classification_id
 * ************************** */
async function getUnapprovedInventoryByClassificationId(classification_id) {
  try {
    const query = `
      SELECT * FROM public.inventory 
      WHERE classification_id = $1 AND inv_approved = false`;
    const data = await pool.query(query, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getUnapprovedInventoryByClassificationId error " + error);
    return []
  }
}



module.exports = {getClassifications,
  getListClassifications,
  getInventoryByClassificationId, 
  getInventoryByInventoryId,
  addClassification, 
  addInventory, 
  updateInventory,
  deleteClassification, 
  deleteInventoryItem,
  getUnapprovedClassifications,
  getUnapprovedInventory,
  approveClassification,
  approveInventory,
  getUnapprovedInventoryByClassificationId
};


