const express = require('express')
const router = express.Router()
const multer = require('multer')
var upload = multer()

const controller = require('../controllers')

router.route('/:folderId?')
    .get(controller.list)

router.route('/file/:folderId?')
    .post(upload.single('file'), controller.uploadFile)

router.route('/folder/:folderId?')
    .post(controller.createFolder)
module.exports = router