const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // To parse JSON requests

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const { v4: uuidv4 } = require("uuid");

let apiKeys = {}; // Store API keys in-memory (you can use a database for persistence)

app.post("/generate-api-key", (req, res) => {
  const newKey = uuidv4(); // Generate unique key
  apiKeys[newKey] = { allowedRequests: 1000 }; // Example of limiting requests
  res.json({ apiKey: newKey });
});
app.post("/log-error", (req, res) => {
  const apiKey = req.headers["x-api-key"]; // Expect API key in headers
  if (!apiKeys[apiKey]) {
    return res.status(401).json({ message: "Invalid API Key" });
  }

  const { errorDetails } = req.body;

  // Simple log (you can store it in a file or database)
  console.log("Error logged:", errorDetails);

  // Optionally, decrease the allowed request count
  apiKeys[apiKey].allowedRequests -= 1;

  res.status(200).json({ message: "Error logged successfully" });
});
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKeys[apiKey] && apiKeys[apiKey].allowedRequests > 0) {
    next();
  } else {
    res.status(403).json({ message: "API Key is invalid or quota exceeded" });
  }
});
