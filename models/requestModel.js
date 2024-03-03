const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    insights: {
      type: [String], // Array of strings for insights
      required: true,
    },
    budget_for_next_month: {
      type: Schema.Types.Mixed, // Object for budget_for_next_month
      required: true,
    },
    suggestions: {
      type: [String], // Array of strings for suggestions
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
