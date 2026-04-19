const express = require("express");
const { getUsers, createUserByAdmin, deleteUserByAdmin } = require("../controllers/userController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate, requireRole("admin"));
router.get("/", getUsers);
router.post("/", createUserByAdmin);
router.delete("/:id", deleteUserByAdmin);

module.exports = router;
