const jwt = require("jsonwebtoken");

class JwtUtilities {
  static verifyJWT(token, secret) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtUtilities;


// const jsonwebtoken = require("jsonwebtoken");

// const generateJWT = (payload, secret) => {
//     return jsonwebtoken.sign(payload, secret);
// };

// const verifyJWT = (token, secret) => {
//     return jsonwebtoken.verify(token, secret);
// };

// const decodeJWT = (token) => {
//     return jsonwebtoken.decode(token);
// }

// module.exports = { generateJWT, verifyJWT, decodeJWT };
