require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/UserModel");
const AuthenticationError = require("../../errorhandlers/AuthenticationError");

class AuthenticationManager {

  static async register(payload) {
    const userModel = new UserModel();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await userModel.createUser({
      email: payload.email,
      password_hash: hashedPassword,
      name: payload.name,
      phone: payload.phone,
      gender: payload.gender,
      profile_picture_url: payload.profile_picture_url,
    });

    return {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      profile_picture_url: user.profile_picture_url,
    };
  }

  static async login(email, password) { // accept plain password
    const userModel = new UserModel();

    const user = await userModel.getUserRoleById({ email });
    if (!user) throw new AuthenticationError("Invalid email or password");

    // Compare plain password with hashed password in DB

    console.log("Login password:", password);
    console.log("DB password hash:", user.password_hash);
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log("Password valid:", isValid);
    if (!isValid) throw new AuthenticationError("Invalid email or password");

    const payload = {
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    return {
      jwt_token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role_name,
      },
    };
  }
}

module.exports = AuthenticationManager;
