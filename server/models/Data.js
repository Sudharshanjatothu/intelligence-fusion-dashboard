const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  title: String,
  description: String,
  latitude: Number,
  longitude: Number,
  imageUrl: String,
  source: String
});

// ✅ Let mongoose handle collection name
module.exports = mongoose.model("Data", DataSchema);