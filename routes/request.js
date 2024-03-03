const express = require("express");
const {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
  updateRequest,
  sendRequest,
  sendRequest2,
} = require("../controllers/requestController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all Request routes
router.use(requireAuth);

// send request to openai
router.get("/send", sendRequest);

// send request to openai
router.get("/send2", sendRequest2);

// GET all Requests
router.get("/", getRequests);

//GET a single Request
router.get("/:id", getRequest);

// POST a new Request
router.post("/", createRequest);

// DELETE a Request
router.delete("/:id", deleteRequest);

// UPDATE a Request
router.patch("/:id", updateRequest);

module.exports = router;
