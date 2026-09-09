const jwt = require ('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async(req,res,next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token

    if(!token){
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findById(decoded.userId)

    if(!user){
      return res.status(401).json({
        success: false,
        message: 'No user exists'
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

module.exports = authMiddleware;