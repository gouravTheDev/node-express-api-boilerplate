var mongoose = require("mongoose");
const User = require("../models/user");

var studentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    guardianName: {
      type: String,
      required: true,
    },
    club: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
    },
    currentStudent: {
      type: Boolean,
      required: true,
    },
    profilePicture:{
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
