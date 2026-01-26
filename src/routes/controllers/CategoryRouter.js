const CategoryManager = require("../../businesslogic/managers/CategoryManager");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { appWrapper } = require("../routeWrapper");
const {ACCESS_ROLES}  =require("../../businesslogic/accessmanagement/roleConstants");
const CategoryModel = require("../../models/CategoryModel");



router.post("/createGlobal",

  appWrapper(async(req,res)=> {
    const globalCategory = await CategoryManager.createGlobalCategory(req.body);
    
    return res.json({
      success:true,
      data:globalCategory,
      message:"Global Category created successfully"
    });

  }, [ACCESS_ROLES.ACCOUNT_SUPER_ADMIN])
)

router.get('/list_global',
  appWrapper (async (req,res) => {
    const globalCategories = await CategoryManager.findAllGlobalCategories();

    if (!globalCategories || globalCategories.length ===0){
      return res.status (404).json ({
        success:false,
        message:"No global categories found"
      });
    }

    return res.json ({
      success:true,
      data:globalCategories
    });
  }, [ACCESS_ROLES.ACCOUNT_SUPER_ADMIN])
)

router.post("/create",
  appWrapper(async(req,res)=> {
    const category = await CategoryManager.createCategory(req.body);


    return res.json({
      success:true,
      data:category,
      message:"Category created successfully"
    });

  },[ACCESS_ROLES.ACCOUNT_SUPER_ADMIN]
)
)

router.post(
  "/delete/:id",
  appWrapper(async (req, res) => {
    try {
      const categoryId = Number(req.params.id);

      const result = await CategoryManager.deleteCategoryById(
        categoryId,
        res.locals.user?.user_id
      );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }, [ACCESS_ROLES.ALL])
);



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