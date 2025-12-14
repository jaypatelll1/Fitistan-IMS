const jwt = require("jsonwebtoken");
const logger = require("./logger");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  logger.error("❌ JWT_SECRET must be at least 32 characters long");
  process.exit(1);
}

class JWTHelper {
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "inventory-api",
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "inventory-api",
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }

  static generateTokenPair(user) {
    const payload = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTHelper;
