const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const router = require('./Router/index')

dotenv.config()
const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected...!'))

app.use('/images', express.static('./public/images'));

app.use('/', router)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Server started on port ' + port + '...!')
})