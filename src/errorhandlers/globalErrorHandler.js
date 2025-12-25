// const ValidationError = require("./ValidationError");
// const AuthenticationError = require("./AuthenticationError");
// const AccessPermissionError = require("./AccessPermissionError");

// module.exports = (err, req, res, next) => {
//   console.error("GLOBAL ERROR:", err);

//   // 🟡 Joi / Validation errors
//   if (err instanceof ValidationError) {
//     return res.status(err.status || 400).json({
//       status: err.status || 400,
//       message: err.message || "Validation Error",
//       body_errors: err.response.body_errors
//     });
//   }

//   // 🔐 Auth errors
//   if (
//     err instanceof AuthenticationError ||
//     err instanceof AccessPermissionError
//   ) {
//     return res.status(err.status || 401).json({
//       status: err.status || 401,
//       message: err.message
//     });
//   }

//   // 🔥 Fallback (unexpected errors)
//   return res.status(500).json({
//     status: 500,
//     message: "Internal Server Error"
//   });
// };
