const AuthenticationManager = require("../../businesslogic/managers/AuthenticationManager");
const ResponseHandler = require("../../utils/responseHandler");

class AuthController {

  static async register(req, res, next) {
    try {
      const payload = req.body;
      const user = await AuthenticationManager.register(payload);
      return ResponseHandler.success(res, user, "Registration successful");
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body; // Accept plain password
      const result = await AuthenticationManager.login(email, password);
      res.json({ success: true, message: "Login successful", data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
