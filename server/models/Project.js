const mongoose = require("mongoose");

// This schema tells MongoDB what a project document should look like.
const projectSchema = new mongoose.Schema({
  // Title is required because every project should have a name.
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Description helps explain what the project is about.
  description: {
    type: String,
    trim: true
  },

  // createdAt stores the time when the project was created.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model so controllers can use it to talk to MongoDB.
module.exports = mongoose.model("Project", projectSchema);

