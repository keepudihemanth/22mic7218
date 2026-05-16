require("dotenv").config();

const axios = require("axios");

const Log = async (stack, level, packageName, message) => {
  try {
    await axios.post(
      process.env.LOG_API_URL,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
  } catch (error) {
    // silent fail
  }
};

module.exports = Log;