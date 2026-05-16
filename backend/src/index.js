const express = require("express");
const cors = require("cors");
const Log = require("logging-middleware/src/logger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  await Log(
    "backend",
    "info",
    "route",
    "Health endpoint accessed successfully"
  );

  res.json({
    success: true,
    message: "Backend running successfully",
  });
});

const PORT = 5000;

app.listen(PORT, async () => {
  await Log(
    "backend",
    "info",
    "server",
    `Server started on port ${PORT}`
  );
});