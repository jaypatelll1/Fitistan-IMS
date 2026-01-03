require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("../../models/AuthModel");
const AuthenticationError = require("../../errorhandlers/AuthenticationError");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");

const {
  registerSchema,
  loginSchema
} = require("../../validators/AuthValidator");
const { ADMIN } = require("../../models/libs/seedConstants");

class AuthenticationManager {

  static async register(payload) {
    // ✅ Joi validation here
    const { error, value } = registerSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      throw new JoiValidatorError(error);
    }

    const userModel = new AuthModel();

    value.password_hash = await bcrypt.hash(value.password, 10);
    delete value.password;

    const user = await userModel.createUser({
      email: value.email,
      password_hash: value.password_hash,
      name: value.name,
      phone: value.phone,
      gender: value.gender,
      profile_picture_url: value.profile_picture_url,
      role_id: value.role_id
    });

    delete user.password_hash;
    return user;
  }

  static async login(email, password) {
    // ✅ Joi validation here
    const { error } = loginSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    if (error) {
      throw new JoiValidatorError(error);
    }

    const userModel = new AuthModel();

    const user = await userModel.getUserForLogin(email);
    if (!user) throw new AuthenticationError("Invalid email or password");

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new AuthenticationError("Invalid email or password");

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET_KEY,
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

  static async loginWithGoogle(googleProfile) {
    if (!googleProfile?.emails?.length) {
      throw new AuthenticationError("Invalid Google profile");
    }

    const email = googleProfile.emails[0].value;
    const name = googleProfile.displayName;
    const googleId = googleProfile.id;
    const profilePicture = googleProfile.photos?.[0]?.value;

    const userModel = new AuthModel();

    // 1️⃣ Check if user already exists
    let user = await userModel.getUserByEmail(email);

    //If exists by password and linking google 
    if (user && !user.google_id) {
      await userModel.linkGoogleId(user.user_id, googleId);
    }

    // 2️⃣ If not, create user
    if (!user) {
      user = await userModel.createGoogleUser({
        email,
        name,
        google_id: googleId,
        profile_picture_url: profilePicture,
        role_id: ADMIN // default user role
      });
    }

    // 3️⃣ Issue JWT (same format as normal login)
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET_KEY,
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
