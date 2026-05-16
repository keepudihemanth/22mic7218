const axios = require("axios");

const Log = async (stack, level, packageName, message) => {
  try {
    const payload = {
      stack,
      level,
      package: packageName,
      message,
    };

    await axios.post("http://4.224.186.213/evaluation-service/logs", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Avoid console.log based on requirements
  }
};

module.exports = Log;