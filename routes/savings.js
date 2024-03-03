const express = require("express");
const {
  createSaving,
  getSavings,
  getSaving,
  deleteSaving,
  updateSaving,
} = require("../controllers/savingController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all Saving routes
router.use(requireAuth);

// GET all Savings
router.get("/", getSavings);

//GET a single Saving
router.get("/:id", getSaving);

// POST a new Saving
router.post("/", createSaving);

// DELETE a Saving
router.delete("/:id", deleteSaving);

// UPDATE a Saving
router.patch("/:id", updateSaving);

module.exports = router;
