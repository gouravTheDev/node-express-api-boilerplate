var mongoose = require("mongoose");

var clubSchema = new mongoose.Schema(
  {
    clubCode: {
      type: String,
      required: true,
    },
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
