const AuthService = require('../services/auth.service');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, Name,  phone } = req.body;
      
      const result = await AuthService.register({
        email,
        password,
        name: Name,
        phone,
      });

      logger.info(`✅ New user registered: ${email}`);
      return ResponseHandler.created(
        res,
        result,
        'Registration successful'
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      logger.info(`✅ User logged in: ${email}`);
      return ResponseHandler.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);

      return ResponseHandler.success(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      await AuthService.logout(req.user.id);
      return ResponseHandler.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      return ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);

      return ResponseHandler.success(
        res,
        null,
        'Password reset instructions sent to email'
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);

      return ResponseHandler.success(res, null, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
