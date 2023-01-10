require('dotenv').config({ path: __dirname + '../../.env' })
const express = require("express")
const PORT = process.env.PORT || 5000
const app = express()

app.use('/api/v1', require('./api'))

app.listen(PORT, () => console.log(`start listening on port : ${PORT}`));
