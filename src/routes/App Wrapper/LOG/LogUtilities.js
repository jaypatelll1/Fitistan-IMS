// routes/App Wrapper/LOG/LogUtilities.js

const logError = (fileName, message, error) => {
  console.error(`[${fileName}] ${message}`);
  if (error) console.error(error);
};

module.exports = { logError };
