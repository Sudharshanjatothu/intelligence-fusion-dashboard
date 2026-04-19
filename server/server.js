const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 Serve uploaded images
app.use("/uploads", express.static("uploads"));

mongoose.set("bufferCommands", false);

// 🔧 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder inside /server
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📂 Image upload route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
  });
});

async function startServer() {
  console.log("Starting server...");

  try {
    const conn = await mongoose.connect(
      "mongodb+srv://admin:admin900@cluster0.gqfrabs.mongodb.net/fusionDB"
    );

    console.log("MongoDB connected to:", conn.connection.host);

    // ✅ Import routes AFTER DB connect
    const dataRoutes = require("./routes/dataRoutes");
    app.use("/", dataRoutes);

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

startServer();