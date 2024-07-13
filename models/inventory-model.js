const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
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
        WHERE i.classification_id = $1`,
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


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassification, addInventory};


