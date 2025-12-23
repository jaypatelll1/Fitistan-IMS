const fs = require("fs");
const path = require("path");

class LogUtilities {
    static createLog = (logFileName, type, data) => {
        const logFilePath = path.join(__dirname, `../../logs/${logFileName}`);
        const logData = `${type} ${Date.now()} - ${JSON.stringify(data)}\n\n-----\n\n`;

        fs.appendFile(logFilePath, logData, (e) => {
            if (e) {
                console.error("Failed to log request: ", e);
            }
        });
    };
}

module.exports = LogUtilities;
