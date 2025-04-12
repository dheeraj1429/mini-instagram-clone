require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const defaultDestination = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(defaultDestination)) {
  fs.mkdirSync(defaultDestination);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = req.query.folderPath;
    const fullPath = folderPath
      ? path.join(defaultDestination, folderPath)
      : defaultDestination;

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`dir created: ${fullPath}`);
    }

    cb(null, fullPath);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const folderPath = req.query.folderPath || "";
  const filePath = `/uploads/${folderPath}/${req.file.filename}`.replace(
    /\/+/g,
    "/"
  );

  res.json({
    filename: req.file.filename,
    path: filePath,
    folder: folderPath,
  });
});

app.use("/uploads", express.static(defaultDestination));

app.listen(process.env.PORT, () => {
  console.log(`Storage server running on port ${process.env.PORT}`);
});
