// require('dotenv').config();
// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const fileUpload = require('express-fileupload');
// const RouteMap = require('./src/routes/middleware/RouteMap');
// const ErrorHandler = require('./src/errorhandlers/ErrorHandler');

// const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, './src/views'));
// app.set('view engine', 'ejs');

// let corsOptions;
// if (process.env.NODE_ENV === "production") {
//     // TODO: Implement dynamic origins so as to accommodate all internal and third party domains
//     corsOptions = {
//         origin: function (origin, callback) {
//             return callback(null, true);
//         },
//         credentials: true,
//         optionsSuccessStatus: 200
//     };
// } else {
//     corsOptions = {
//         origin: function (origin, callback) {
//             return callback(null, true);
//         },
//         credentials: true,
//         optionsSuccessStatus: 200
//     };
// }

// app.use(cors(corsOptions));

// logger.token('user-id', (req, res) => res.locals.userInfo ? res.locals.userInfo['user']['user_id'] : 'anonymous');
// logger.token('app-version', (req, res) => req.headers['x-fitistan-app-version'] || 'anonymous');
// logger.token('platform', (req, res) => req.headers['x-fitistan-platform'] || 'anonymous');
// logger.token('tech', (req, res) => req.headers['x-fitistan-tech'] || 'anonymous');

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/users", require("./routes/user.routes"));
app.use("/api/v1/shelf", require("./routes/shelf.routes"));
// Add other routes here

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
