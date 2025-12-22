const AuthenticationManager = require("../../businesslogic/managers/AuthenticationManager");

class UserController {

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await AuthenticationManager.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res) {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  }
}

module.exports = UserController;
