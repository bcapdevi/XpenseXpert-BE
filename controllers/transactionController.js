const Transaction = require("../models/transactionModel");
const mongoose = require("mongoose");

// get all transactions
const getTransactions = async (req, res) => {
  const user_id = req.user._id;

  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  res.status(200).json(transactions);
};

// get a single transaction
const getTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such transaction" });
  }

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    return res.status(404).json({ error: "No such transaction" });
  }

  res.status(200).json(transaction);
};

// create new transaction
const createTransaction = async (req, res) => {
  const { type, amount, category } = req.body;

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
  }
  if (!amount) {
    emptyFields.push("amount");
  }
  if (!category) {
    emptyFields.push("category");
  }
  // if (!date) {
  //   emptyFields.push("date");
  // }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const transaction = await Transaction.create({
      type,
      amount,
      category,
      user_id,
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such transaction" });
  }

  const transaction = await Transaction.findOneAndDelete({ _id: id });

  if (!transaction) {
    return res.status(400).json({ error: "No such transaction" });
  }

  res.status(200).json(transaction);
};

// update a transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such transaction" });
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!transaction) {
    return res.status(400).json({ error: "No such transaction" });
  }

  res.status(200).json(transaction);
};

// get all transactions breakdown
const getTransactionsBreakdown = async (req, res) => {
  const user_id = req.user._id;

  // Retrieve the transactions for the user
  const transactions = await Transaction.find({ user_id });
  // console.log(transactions);

  // Calculate the total expenditure per category
  const categoryTotals = {};

  const currentDate = new Date();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    if (
      transaction.type === "Expense" &&
      transactionDate.getMonth() === currentDate.getMonth()
    ) {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
    }
  });

  // Convert the category totals into an array of objects
  categoriesArray = Object.keys(categoryTotals).map((category, index) => ({
    id: index + 1, // You can use a different method to generate unique IDs
    value: categoryTotals[category],
    label: category,
  }));
  res.status(200).json(categoriesArray);
};

// get all transactions breakdown
const getIncomeBreakdown = async (req, res) => {
  const user_id = req.user._id;

  // Retrieve the transactions for the user
  const transactions = await Transaction.find({ user_id });
  // console.log(transactions);

  // Calculate the total expenditure per category
  const categoryTotals = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "Income") {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
    }
  });

  // Convert the category totals into an array of objects
  categoriesArray = Object.keys(categoryTotals).map((category, index) => ({
    id: index + 1, // You can use a different method to generate unique IDs
    value: categoryTotals[category],
    label: category,
  }));
  res.status(200).json(categoriesArray);
};

const storeTransactions = async (req, res) => {
  const user_id = req.user._id;

  const novemberTransactions = [
    {
      type: "Expense",
      amount: 85,
      category: "Eating Out",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-16T19:30:00.000Z",
      createdAt: "2024-02-16T19:30:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 950,
      category: "Rent",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-15T09:15:00.000Z",
      createdAt: "2024-02-15T09:15:00.000Z",
      __v: 0,
    },
    {
      type: "Income",
      amount: 1900,
      category: "Employment",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-12T10:20:00.000Z",
      createdAt: "2024-02-12T10:20:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 65,
      category: "Internet Utility",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-10T12:45:00.000Z",
      createdAt: "2024-02-10T12:45:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 145,
      category: "Groceries",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-05T08:30:00.000Z",
      createdAt: "2024-02-05T08:30:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 110,
      category: "Groceries",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-02-04T08:30:00.000Z",
      createdAt: "2024-02-04T08:30:00.000Z",
      __v: 0,
    },
    {
      type: "Income",
      amount: 2300,
      category: "Employment",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-01-28T18:15:00.000Z",
      createdAt: "2024-01-28T18:15:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 110,
      category: "Electricity",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-01-22T20:15:00.000Z",
      createdAt: "2024-01-22T20:15:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 85,
      category: "Subscription",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-01-20T20:15:00.000Z",
      createdAt: "2024-01-20T20:15:00.000Z",
      __v: 0,
    },
    {
      type: "Income",
      amount: 2100,
      category: "Employment",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-01-18T17:45:00.000Z",
      createdAt: "2024-01-18T17:45:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 95,
      category: "Water Utility",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2024-01-10T19:45:00.000Z",
      createdAt: "2024-01-10T19:45:00.000Z",
      __v: 0,
    },
    {
      type: "Income",
      amount: 2000,
      category: "Employment",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2023-12-08T14:00:00.000Z",
      createdAt: "2023-12-08T14:00:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 75,
      category: "Internet Utility",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2023-12-05T12:30:00.000Z",
      createdAt: "2023-12-05T12:30:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 90,
      category: "Eating Out",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2023-11-10T19:45:00.000Z",
      createdAt: "2023-11-10T19:45:00.000Z",
      __v: 0,
    },
    {
      type: "Expense",
      amount: 320,
      category: "Groceries",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2023-10-15T14:20:00.000Z",
      createdAt: "2023-10-15T14:20:00.000Z",
      __v: 0,
    },
    {
      type: "Income",
      amount: 2200,
      category: "Employment",
      user_id: "656ae324925e20e31b2ce8b3",
      updatedAt: "2023-10-12T09:30:00.000Z",
      createdAt: "2023-10-12T09:30:00.000Z",
      __v: 0,
    },
  ];

  const savedTransactions = [];

  // Loop through each transaction in novemberTransactions
  for (const transactionData of novemberTransactions) {
    const { type, amount, category, createdAt, updatedAt } = transactionData;

    // Create a new transaction document and save it to the database
    try {
      const transaction = await Transaction.create({
        type,
        amount,
        category,
        user_id,
        createdAt,
        updatedAt,
      });

      savedTransactions.push(transaction); // Add the saved transaction to the array
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.status(200).json(savedTransactions);
};

module.exports = {
  getTransactions,
  getTransaction,
  getTransactionsBreakdown,
  getIncomeBreakdown,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  storeTransactions,
};
