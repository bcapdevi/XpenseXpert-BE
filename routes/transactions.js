const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionsBreakdown,
  getIncomeBreakdown,
  storeTransactions,
} = require("../controllers/transactionController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all Transaction routes
router.use(requireAuth);

// GET all Transactions
router.get("/", getTransactions);

// GET the transactions breakdown by category
router.get("/breakdown", getTransactionsBreakdown);

router.get("/storemultiple", storeTransactions);

// GET the transactions breakdown by category
router.get("/income", getIncomeBreakdown);

//GET a single Transaction
router.get("/:id", getTransaction);

// POST a new Transaction
router.post("/", createTransaction);

// DELETE a Transaction
router.delete("/:id", deleteTransaction);

// UPDATE a Transaction
router.patch("/:id", updateTransaction);

module.exports = router;
