
require('dotenv').config({ path: __dirname + '../../.env' })

const express = require('express')
const router = express.Router()

const fbController = require('./api/fb-controller')

//#region fb api
router
    .route("/getPageDetails")
    .get(fbController.getPageDetails)
    .post(fbController.getPageDetails)
//#endregion

module.exports = router