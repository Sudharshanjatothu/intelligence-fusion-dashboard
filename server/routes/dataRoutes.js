const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// ➕ Add data
router.post("/add", async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();
    res.json({ message: "Data added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;