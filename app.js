const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// API Endpoint to return data
app.get("/data", (req, res) => {
  const responseData = {
    message: "Hello, this is your API!",
    author: "Your Name",
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(responseData); // Return JSON data
});

// API Endpoint to report errors
app.post("/report-error", (req, res) => {
  const { message, url, timestamp } = req.body;

  // Log error details to the console (or save to a file/database)
  console.error(`Error reported from ${url} at ${timestamp}: ${message}`);

  res.status(200).json({ success: true, message: "Error logged successfully" });
});

// Error Handling for Non-existing Routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
