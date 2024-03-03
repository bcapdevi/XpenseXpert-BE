const express = require('express')
const {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory
} = require('../controllers/categoryController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all Category routes
router.use(requireAuth)

// GET all Categories
router.get('/', getCategories)

//GET a single Category
router.get('/:id', getCategory)

// POST a new Category
router.post('/', createCategory)

// DELETE a Category
router.delete('/:id', deleteCategory)

// UPDATE a Category
router.patch('/:id', updateCategory)


module.exports = router