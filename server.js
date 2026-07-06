/**
 * MB Global Apparels — static site server
 * Simple Express server for hosting the site on Railway (or anywhere Node runs).
 */
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static assets (html, css, js) from this directory
app.use(express.static(__dirname, { extensions: ["html"] }));

// Fallback 404 page for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(PORT, () => {
  console.log(`MB Global Apparels site running on port ${PORT}`);
});
