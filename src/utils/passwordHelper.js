const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class PasswordHelper {
  static async hash(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }


  static hashToken(token) {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  static generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters`);
    }
    if (!hasUpperCase) errors.push("Password must contain uppercase letter");
    if (!hasLowerCase) errors.push("Password must contain lowercase letter");
    if (!hasNumbers) errors.push("Password must contain number");
    if (!hasSpecialChar) errors.push("Password must contain special character");

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = PasswordHelper;
