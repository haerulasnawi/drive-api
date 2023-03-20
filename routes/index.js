const express = require('express')
const router = express.Router()
const multer = require('multer')
var upload = multer()

const controller= require('../controllers')

router.route('/:folderId?')
    .get(controller.get)
    .post(upload.single('file'), controller.post)
module.exports = router