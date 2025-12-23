const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class passwordHelper {
  static async hash(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async compare(password, hashedpassword) {
    return bcrypt.compare(password, hashedpassword);
  }

  static generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static validatepassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`password must be at least ${minLength} characters`);
    }
    if (!hasUpperCase) errors.push("password must contain uppercase letter");
    if (!hasLowerCase) errors.push("password must contain lowercase letter");
    if (!hasNumbers) errors.push("password must contain number");
    if (!hasSpecialChar) errors.push("password must contain special character");

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = passwordHelper;
