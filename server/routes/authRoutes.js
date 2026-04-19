const express = require("express");
const { signup, login, getMyProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getMyProfile);

module.exports = router;
