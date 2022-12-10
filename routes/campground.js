const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync');
const { isLoggedin, isAuthor, validateCamp } = require('../middleware');
const campgr = require('../controller/campground');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgr.index))
    .post(isLoggedin, upload.array('camp[image]'), validateCamp, wrapAsync(campgr.makeCamp));

router.get('/new', isLoggedin, campgr.renderNew);

router.route('/:id')
    .get(wrapAsync(campgr.detail))
    .put(isLoggedin, isAuthor, upload.array('camp[image]'), validateCamp, wrapAsync(campgr.update))
    .delete(isLoggedin, isAuthor, wrapAsync(campgr.delete));

router.get('/:id/edit', isLoggedin, isAuthor, wrapAsync(campgr.renderEdit));

module.exports = router;