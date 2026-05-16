require("dotenv").config({
  path: "../.env",
});
console.log(process.env.NOTIFICATION_API);
console.log(process.env.ACCESS_TOKEN);
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/notifications", async (req, res) => {
  try {
    const response = await axios.get(
      process.env.NOTIFICATION_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },

        params: {
          page: req.query.page,
          limit: req.query.limit,
          notification_type:
            req.query.notification_type,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch notifications",
    });
  }
});

app.listen(5000, () => {
  console.log(
    "Backend running on port 5000"
  );
});