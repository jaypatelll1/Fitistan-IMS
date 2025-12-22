require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/UserModel");
const AuthenticationError = require("../../errorhandlers/AuthenticationError");

class AuthenticationManager {

  
  static async login({ email, password }) {
    const userModel = new UserModel();

  


    // 1. Get user from DB
    const user= await userModel.getUserRoleById({ email });
    console.log(user)
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const userpasswoerd=await bcrypt.hash(password,10);
    console.log(userpasswoerd)
    

   
    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );
    

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // 3. Create JWT payload
    const payload = {
      user: {
        user_id: user.user_id,
        email: user.email,
      }
    };

    // 4. Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 5. Return token + basic user info
    return {
      jwt_token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name
      }
    };
  }

}

module.exports = AuthenticationManager;
