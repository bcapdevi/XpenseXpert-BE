const Saving = require("../models/savingModel");
const mongoose = require("mongoose");

// get all savings
const getSavings = async (req, res) => {
  const user_id = req.user._id;

  const savings = await Saving.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(savings);
};

// get a single saving
const getSaving = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such saving" });
  }

  const saving = await Saving.findById(id);

  if (!saving) {
    return res.status(404).json({ error: "No such saving" });
  }

  res.status(200).json(saving);
};

const createSaving = async (req, res) => {
  const { name, progress, goal } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!progress) {
    emptyFields.push("progress");
  }
  if (!goal) {
    emptyFields.push("goal");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // Check if progress is higher than goal
  if (parseFloat(progress) >= parseFloat(goal)) {
    return res
      .status(400)
      .json({ error: "You have already reached the savings goal." });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const saving = await Saving.create({ name, progress, goal, user_id });
    res.status(200).json(saving);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a saving
const deleteSaving = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such saving" });
  }

  const saving = await Saving.findOneAndDelete({ _id: id });

  if (!saving) {
    return res.status(400).json({ error: "No such saving" });
  }

  res.status(200).json(saving);
};

// update a saving
const updateSaving = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such saving" });
  }

  const saving = await Saving.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!saving) {
    return res.status(400).json({ error: "No such saving" });
  }

  res.status(200).json(saving);
};

module.exports = {
  getSavings,
  getSaving,
  createSaving,
  deleteSaving,
  updateSaving,
};
