const UserModel = require("../models/user.model");
const JWTHelper = require("../utils/jwtHelper");
const PasswordHelper = require("../utils/passwordHelper");
const logger = require("../utils/logger");
const db = require("../config/database"); // ADDED THIS IMPORT

class AuthService {
  static async register(userData) {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Validate password
    const validation = PasswordHelper.validatePassword(userData.password);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    // Hash password
    const hashedPassword = await PasswordHelper.hash(userData.password);

    const {password , ...userPayload} = userData;

    // Create user
    const user = await UserModel.create({
      ...userPayload,
      password_hash: hashedPassword,
    });

    // Generate tokens
    const tokens = JWTHelper.generateTokenPair(user);

    // Save refresh token
    await UserModel.update(user.user_id, {
      refresh_token: tokens.refreshToken,
      last_login: new Date(),
    });

    // Remove sensitive data
    delete user.password;
    delete user.refresh_token;

    return {
      user,
      ...tokens,
    };
  }

  static async login(email, password) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if active
    if (user.status !== "active") {
      throw new Error("Account is inactive. Contact administrator");
    }

    // Verify password
    const isPasswordValid = await PasswordHelper.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const tokens = JWTHelper.generateTokenPair(user);

    // Update refresh token and last login
    await UserModel.update(user.user_id, {
      refresh_token: tokens.refreshToken,
      last_login: new Date(),
    });

    // Remove sensitive data
    delete user.password;
    delete user.refresh_token;

    return {
      user,
      ...tokens,
    };
  }

  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    // Verify token
    const decoded = JWTHelper.verifyToken(refreshToken);

    // Find user
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    if (user.status !== "active") {
      throw new Error("Account is inactive");
    }

    // Generate new tokens
    const tokens = JWTHelper.generateTokenPair(user);

    // Update refresh token
    await UserModel.update(user.user_id, {
      refresh_token: tokens.refreshToken,
    });

    return tokens;
  }

  static async logout(userId) {
    await UserModel.update(userId, { refresh_token: null });
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValid = await PasswordHelper.compare(
      currentPassword,
      user.password
    );
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    const validation = PasswordHelper.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    // Hash and update
    const hashedPassword = await PasswordHelper.hash(newPassword);
    await UserModel.update(userId, {
      password: hashedPassword,
      password_changed_at: new Date(),
      refresh_token: null, // Invalidate all sessions
    });

    logger.info(`Password changed for user: ${user.email}`);
  }

  static async forgotPassword(email) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = PasswordHelper.generateRandomToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await UserModel.update(user.user_id, {
      reset_password_token: resetToken,
      reset_password_expires: expires,
    });

    // TODO: Send email with reset token
    logger.info(`Password reset requested for: ${email}`);
    logger.info(`Reset token: ${resetToken}`); // Remove in production
  }

  static async resetPassword(token, newPassword) {
    const user = await db("users")
      .where("reset_password_token", token)
      .where("reset_password_expires", ">", new Date())
      .first();

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Validate password
    const validation = PasswordHelper.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    // Hash and update
    const hashedPassword = await PasswordHelper.hash(newPassword);
    await UserModel.update(user.user_id, {
      password: hashedPassword,
      password_changed_at: new Date(),
      reset_password_token: null,
      reset_password_expires: null,
      refresh_token: null,
    });

    logger.info(`Password reset successful for: ${user.email}`);
  }
}

module.exports = AuthService;
