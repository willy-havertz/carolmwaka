const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./apiKeyDB.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    allowed_requests INTEGER DEFAULT 1000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Table created or already exists.");
  }
});

db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});
app.post("/generate-api-key", (req, res) => {
  const newKey = uuidv4(); // Generate unique API key
  const query = "INSERT INTO api_keys (key) VALUES (?)";

  connection.query(query, [newKey], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error generating API key", error: err });
    }
    res.json({ apiKey: newKey });
  });
});
app.post("/log-error", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const query = "SELECT * FROM api_keys WHERE key = ?";
  connection.query(query, [apiKey], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    const foundKey = results[0];
    if (foundKey.allowed_requests <= 0) {
      return res.status(403).json({ message: "API Key quota exceeded" });
    }

    // Log the error and decrease allowed requests
    const { errorDetails } = req.body;
    console.log("Error logged:", errorDetails);

    const updateQuery =
      "UPDATE api_keys SET allowed_requests = allowed_requests - 1 WHERE key = ?";
    connection.query(updateQuery, [apiKey], (updateErr) => {
      if (updateErr) {
        return res
          .status(500)
          .json({ message: "Error updating API key", error: updateErr });
      }
      res.status(200).json({ message: "Error logged successfully" });
    });
  });
});
