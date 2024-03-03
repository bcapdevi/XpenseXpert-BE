//import OpenAI from "openai";

const Openai = require("../node_modules/openai");
const Request = require("../models/requestModel");
const Transaction = require("../models/transactionModel");
const {
  getIncomeBreakdown,
  getTransactionsBreakdown,
} = require("../controllers/transactionController");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const openai = new Openai.OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

// get all requests
const getRequests = async (req, res) => {
  const user_id = req.user._id;

  const requests = await Request.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(requests);
};

// get a single request
const getRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such request" });
  }

  const request = await Request.findById(id);

  if (!request) {
    return res.status(404).json({ error: "No such request" });
  }

  res.status(200).json(request);
};

// create new request
const createRequest = async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!body) {
    emptyFields.push("body");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const request = await Request.create({ body, user_id });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a request
const deleteRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such request" });
  }

  const request = await Request.findOneAndDelete({ _id: id });

  if (!request) {
    return res.status(400).json({ error: "No such request" });
  }

  res.status(200).json(request);
};

// update a request
const updateRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such request" });
  }

  const request = await Request.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!request) {
    return res.status(400).json({ error: "No such request" });
  }

  res.status(200).json(request);
};

// send Request to openAI
const sendRequest = async (req, res) => {
  const user_id = req.user._id;

  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-indexed
  const currentYear = currentDate.getFullYear();

  // Calculate last month and handle the case where the current month is January
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Filter transactions for the last month
  const lastMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    return (
      transactionDate.getMonth() + 1 === lastMonth &&
      transactionDate.getFullYear() === lastYear
    );
  });
  console.log(lastMonthTransactions);

  const incomeBreakdown =
    "Here are my monthly transactions: " + JSON.stringify(transactions);

  //getting completion from openai
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a financial advisor tasked with helping individuals handle their money responsibly. Based on the transaction information provided by the user, return a JSON-formatted response with insights, budget_for_next_month, and suggestions.- insights (array of strings): Provide a personalized analysis of the user's spending habits and financial trends from the previous month to the current month (e.g variability in expenses, comparison with previous months, discretionary vs. essential expenses, income percent spent, saving rates for the different months, seasonal spending patterns, life events impact, etc...). Include at least five insightful metrics and statistics, tailored to the user's transactions. - budget_for_next_month (object): Offer recommendations for next month's budget, specifying suggested amounts for different categories based on the user's spending patterns.- suggestions (array of strings): Provide actionable items to help the user meet the suggested budget and improve their financial health. Include at least five personalized suggestions, focusing on optimization strategies, future planning, and educational content.",
      },
      {
        role: "user",
        content: incomeBreakdown,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  //404 if no response from openai
  if (!completion) {
    return res.status(404).json({ error: "No response from openai" });
  }

  try {
    const choices = completion.choices;
    // console.log("Completion:", completion);

    if (choices && choices.length > 0) {
      // Assuming the first choice contains the generated text
      const generatedText = choices[0].message.content;
      insightObject = JSON.parse(generatedText);

      // Save the generated text in a new Request MongoDB object
      const request = await Request.create({
        insights: insightObject.insights,
        budget_for_next_month: insightObject.budget_for_next_month,
        suggestions: insightObject.suggestions,
        user_id: user_id,
      });

      // You can do further processing with the generated text here
      console.log("Generated Text:", generatedText);

      //return completion if true
      res.status(200).json(request);
    } else {
      console.error("Invalid response format. 'choices' array not found.");
      return null;
    }
  } catch (error) {
    console.error("Error parsing GPT-3 response:", error);
    return null;
  }
};

// send Request to openAI
const sendRequest2 = async (req, res) => {
  const user_id = req.user._id;

  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-indexed
  const currentYear = currentDate.getFullYear();

  // Calculate last month and handle the case where the current month is January
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Filter transactions for the last month
  const lastMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    return (
      transactionDate.getMonth() + 1 === lastMonth &&
      transactionDate.getFullYear() === lastYear
    );
  });
  console.log(lastMonthTransactions);

  const incomeBreakdown =
    "Here are my transactions: " + JSON.stringify(transactions);

  //getting completion from openai
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a transaction generator that helps the user come up with realisitc data for the previous months of the year. The user will provide you with an array of transaction objects and you should permutate the object array to have realistic expenses and icome transactions (for someone working as a waiter) and return it as JSON formatted response (do not include backticks or anything that cannot be json formatted). You may overwrite the existing data to fit the new data. The new data should have at least 10 transactions per month from October 2023 to February 17th 2024. Assume that the user pays rent throughout all of the months (about 700 to 1000 dollars). Only use the following expense and income categories with the exact casing (as it is case sensitive). - Income Categories: Self-Employment, Investments, Rental, Business, Bonuses, Pension, Social Security, Education Grants, Employment, Gift. - Expense Categories: Rent, Groceries, Eating Out, Subscription, Water Utility, Electricity, Gift, Internet Utility.",
      },
      {
        role: "user",
        content: incomeBreakdown,
      },
    ],
    model: "gpt-4-0125-preview",
  });

  //404 if no response from openai
  if (!completion) {
    return res.status(404).json({ error: "No response from openai" });
  }

  try {
    const choices = completion.choices;
    // console.log("Completion:", completion);

    if (choices && choices.length > 0) {
      // Assuming the first choice contains the generated text
      const generatedText = choices[0].message.content;
      console.log("Generated Text:", generatedText);
      insightObject = JSON.parse(generatedText);

      // Save the generated text in a new Request MongoDB object
      // const request = await Request.create({
      //   insights: insightObject.insights,
      //   budget_for_next_month: insightObject.budget_for_next_month,
      //   suggestions: insightObject.suggestions,
      //   user_id: user_id,
      // });

      // You can do further processing with the generated text here
      console.log("Generated Text:", generatedText);

      //return completion if true
      res.status(200).json(insightObject);
    } else {
      console.error("Invalid response format. 'choices' array not found.");
      return null;
    }
  } catch (error) {
    console.error("Error parsing GPT-3 response:", error);
    return null;
  }
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest,
  updateRequest,
  sendRequest,
  sendRequest2,
};
