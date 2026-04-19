const express = require("express");
const { getAdminOverview } = require("../controllers/reportController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin-overview", authenticate, requireRole("admin"), getAdminOverview);

module.exports = router;
