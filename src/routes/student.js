const express = require("express");
const multer = require("multer");
const path = require("path");
const { createStudent, getAllStudents } = require("../controllers/Student");
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/role-handler");
const checkPermission = require("../middlewares/permission-handler");

const router = express.Router();

// Middleware for authentication
router.use(authenticate);

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload variable with multer configuration
const upload = multer({ storage });

// Define the route for file upload and student creation
router.post("/upload", upload.single("file"), checkRole(["admin", "Super Admin"]), createStudent);

// Define the route for getting all students
router.get("/", checkPermission(["view_students"]), getAllStudents);

module.exports = router;
