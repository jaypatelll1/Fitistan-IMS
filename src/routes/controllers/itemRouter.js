const express = require("express");
const router = express.Router({ mergeParams: true });


const itemManager = require("../../businesslogic/managers/itemManager");
const { generateBarcodeBuffer } = require("../../utils/barcodeGenerator");
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");

router.post(
  "/addStock",
  // validate(validators.createProductSchema),
  appWrapper(async (req, res) => {
    console.log("add item:", req.body);

    const{quantity,shelf_id,product_id} = req.body;
    const item = await itemManager.createItem(product_id,shelf_id,quantity);
    console.log("item",item);
    if(!item){
        return res.status(404).json({
        success: false,
        message: "product doesnt exist",
      });
    }
    console.log("Item(s) created:", item);
    return res.json({
      success: true,
      data: item,
      message: "Item(s) created successfully",
    });
  }, [ACCESS_ROLES.ALL])   

)

router.post("/removeStock",
appWrapper (async (req,res) => {
    const {product_id,quantity} = req.body;
    const item = await itemManager.removeItemStock(product_id,quantity);
    if(!item){
        return res.status(404).json({
        success: false,
        message: "Item not found or insufficient stock",
      });
    }
    console.log("Item(s) removed:", item);
    return res.json({
      success: true,
        data: item,
        message: "Item(s) removed successfully",
    });

}))

module.exports = router;