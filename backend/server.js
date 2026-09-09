require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')

connectDB().then(() => {
  try {
    app.listen(process.env.PORT, ()=>{
      console.log(`server is running on ${process.env.PORT}`);
  })
  } catch (error) {
    console.log(error)
  }
})

