const CategoryManager = require("../../businesslogic/managers/CategoryManager");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { appWrapper } = require("../routeWrapper");
const {ACCESS_ROLES}  =require("../../businesslogic/accessmanagement/roleConstants");
const CategoryModel = require("../../models/CategoryModel");

router.get(
  "/category_name/:categoryName",
  appWrapper(async (req, res) => {
    const { categoryName } = req.params;

    const products = await CategoryManager.getProductsByCategoryPaginated(
      categoryName,
      res.locals.user?.user_id,
      req.query.page,
      req.query.limit
    );

    if (!products || products.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found for category: ${categoryName}`,
      });
    }

    return res.json({
      success: true,
      data: products,
    });
  }, [ACCESS_ROLES.ALL])
);

router.get(
  "/list",
  appWrapper(async (req, res) => {
    const categories = await CategoryModel.findAll();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found"
      });
    }

    return res.json({
      success: true,
      data: categories
    });
  }, [ACCESS_ROLES.ALL])
);






module.exports = router;