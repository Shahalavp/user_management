const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require("./routes/adminRoutes");

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api',authRoutes)
app.use('/api/admin', adminRoutes)

app.get('/',(req,res) => {
  res.send('User Management API is running...')
})

module.exports = app;