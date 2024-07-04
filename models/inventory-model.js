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

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId};

