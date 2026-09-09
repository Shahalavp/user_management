const express = require('express')
const router = express.Router()
const {signup, login, getProfile, getUsers, getUserHome, logout} = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')

router.post('/auth/signup', signup)
router.post('/auth/login', login)
router.get('/', getUsers)
router.get('/user/profile', authMiddleware, getProfile)
router.get('/user/home', authMiddleware, getUserHome)
router.post('/auth/logout', logout)

module.exports = router;