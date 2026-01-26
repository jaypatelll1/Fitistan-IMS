const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const CategoryModel = require("../../models/CategoryModel");
const ProductModel = require("../../models/ProductModel");
const validationError= require("../../errorhandlers/ValidationError");
const { createCategorySchema,createGlobalCategorySchema } = require("../../validators/categoryValidator");


class CategoryManager {


   static async getProductsByCategoryPaginated(categoryName, userId, page, limit) {
    try {
      // 1️⃣ Validate category
      const category = await CategoryModel.findByName(categoryName);
      if (!category) {
        throw new validationError("Invalid category");
      }

      // 2️⃣ Product model instance
      const productModel = new ProductModel(userId);

      // 3️⃣ Fetch paginated data (same as reference)
      const result = await productModel.findByCategoryIdPaginated(
        category.category_id,
        page,
        limit
      );

      console.log("Paginated products for category:", categoryName, result);
      const totalPages = Math.ceil(result.total / limit);
      const offset = (page - 1) * limit;

      return {
        products: result.data,
        total: result.total,
        page,
        limit,
        offset,
        totalPages,
        previous: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null
      };
    } catch (err) {
      throw new Error(`Failed to fetch category products: ${err.message}`);
    }
  }

  static async createGlobalCategory(payload){
    const{error,value} =createGlobalCategorySchema.validate(payload,{
      abortEarly:false,
     stripUnknown:true

    })
    if (error){
      throw new JoiValidatorError (error);
    
    }
    const existingCategory= await CategoryModel.findGlobalByName(value.category_name);

  if (existingCategory){
    throw new validationError ("Global Category with this name already exists");

  }
  return CategoryModel.createGlobal(
    {category_name:value.category_name},
  
  );
}

static async findAllGlobalCategories(){
  
  return CategoryModel.findAllGlobal();
}
static async createCategory(payload) {
  const { error, value } = createCategorySchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    throw new JoiValidatorError(error);
  }

  // 1️⃣ Check if global category exists
  console.log("Validated payload value:", value);
console.log("global_category_id:", value.global_category_id);
  const globalCategory =
    await CategoryModel.findGlobalById(value.global_category_id);

  if (!globalCategory) {
    throw new ValidationError("Global category does not exist");
  }

  // 2️⃣ Check duplicate category under same global category
  const existingCategory =
    await CategoryModel.findByNameAndGlobal(
      value.category_name,
      value.global_category_id
    );

  if (existingCategory) {
    throw new ValidationError(
      "Category with this name already exists under this global category"
    );
  }

  // 3️⃣ Create sub-category
  return CategoryModel.create({
    category_name: value.category_name,
    global_category_id: value.global_category_id
  });
}



static async deleteCategoryById(categoryId, userId) {
  // 1️⃣ Check category exists
  const category = await CategoryModel.findById(categoryId);

  if (!category || category.is_deleted) {
    throw new Error("Category not found");
  }

  // 2️⃣ Check if products exist
  const productModel = new ProductModel(userId);
  const productCount = await productModel.countByCategoryId(categoryId);

  if (productCount > 0) {
    throw new Error("Category cannot be deleted because products exist");
  }

  // 3️⃣ Soft delete
  await CategoryModel.categoryDelete(categoryId);

  return {
    category_id: categoryId,
    deleted: true,
    message: "Category deleted successfully"
  };
}



}


module.exports = CategoryManager;