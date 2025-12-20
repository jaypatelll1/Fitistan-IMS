const express = require("express");
const { successResponseAppWrapper, appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const shelfManager =require("../../businesslogic/managers/ShelfManager")

const router = express.Router({ mergeParams: true });

//get all shelves
router.get("/all", appWrapper(async (req, res) => {
      
    const getAllShelves = await shelfManager.getAllShelf()
    return res.json({
        success: true,
        data :getAllShelves
    })
    
    }, [ACCESS_ROLES.ALL])
);

//create shelf
router.post("/create",appWrapper(async (req,res)=>{

const createShelf = await shelfManager.createShelf(req.body)
return res.json({
    succes:true ,
    data: createShelf,
    message:"data inserted succesfully"
})
},[ACCESS_ROLES.ALL]))

//get shelf by id
router.get("/:id",appWrapper (async (req,res)=>{
    const {id} = req.params
    const getShelfById = await shelfManager.getShelfById(id)    
    return res.json({
        success:true,
        data:getShelfById
    })
},[ACCESS_ROLES.ALL]))

//update shelf
router.put("/update/:id",appWrapper (async (req,res)=>{
    const {id} = req.params
    const updateShelf = await shelfManager.updateShelf(id,req.body)
    return res.json({
        success:true,
        data:updateShelf,
        message:"data updated succesfully"
    })
},[ACCESS_ROLES.ALL]))

//delete shelf
router.post("/delete/:id",appWrapper (async (req,res)=>{
    const {id} = req.params
    const deleteShelf = await shelfManager.deleteShelf(id)  
    return res.json({
        success:true,
        data:deleteShelf,
        message:"data deleted succesfully"
    })
},[ACCESS_ROLES.ALL]))

module.exports = router;


