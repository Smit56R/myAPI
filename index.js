require('dotenv').config()

const PORT = 8081
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

const developersRouter = require('./routes/developers')
app.use('/developers', developersRouter)

app.listen(PORT, () => console.log("Server Started"))