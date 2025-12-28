const userModel = require("../../models/usermodel");
const JoiValidationError = require("../../errorhandlers/JoiValidationError");
const { profileUpdateSchema } = require("../../validators/userValidator");

class UserManager {

  static async profileUpdate(userId, userData) {
    try {
  const { error, value } = profileUpdateSchema.validate(userData, {
      abortEarly: false,
      stripUnknown: true
  });
  if (error) throw new JoiValidationError(error);


      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const userprofile = await userModel.update(userId, value);

      if (!userprofile) {
        throw new Error("No fields to update or user does not exist");
      }
       

      return userprofile;
     
    } catch (err) {
      throw new Error(`Failed to update user profile: ${err.message}`);
    }
  }
}


module.exports = UserManager;