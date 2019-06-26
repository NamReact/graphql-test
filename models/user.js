const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ]
});

module.exports = User;
