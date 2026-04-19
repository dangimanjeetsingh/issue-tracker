const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch users.", error: error.message });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (role === "admin") {
      return res.status(400).json({ message: "Only one admin is allowed. Create user accounts only." });
    }


    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user"
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to create user.", error: error.message });
  }
};

module.exports = {
  getUsers,
  createUserByAdmin,
  deleteUserByAdmin: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select("-passwordHash");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.role === "admin") {
        return res.status(400).json({ message: "Admin account cannot be deleted." });
      }

      await User.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Unable to delete user.", error: error.message });
    }
  }
};
