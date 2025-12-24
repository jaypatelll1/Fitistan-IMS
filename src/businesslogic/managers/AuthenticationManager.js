require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("../../models/AuthModel");
const AuthenticationError = require("../../errorhandlers/AuthenticationError");

class AuthenticationManager {

  static async register(payload) {
    const userModel = new AuthModel();

    payload.password_hash = await bcrypt.hash(payload.password, 10);
    delete payload.password;

    if (!payload.role_id) {
      throw new AuthenticationError("role_id is required");
    }

    const user = await userModel.createUser({
      email: payload.email,
      password_hash: payload.password_hash,
      name: payload.name,
      phone: payload.phone,
      gender: payload.gender,
      profile_picture_url: payload.profile_picture_url,
      role_id: payload.role_id
    });

    delete user.password_hash;
    return user;
  }

  static async login(email, password) {
    const userModel = new AuthModel();

    const user = await userModel.getUserForLogin(email);
    if (!user) throw new AuthenticationError("Invalid email or password");

    if (!user.password_hash) {
      throw new AuthenticationError("User password not set");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new AuthenticationError("Invalid email or password");

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET_KEY, // must be defined
      { expiresIn: "7d" }
    );

    return {
      jwt_token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role_name
      }
    };
  }
}

module.exports = AuthenticationManager;
