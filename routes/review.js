const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../util/wrapAsync');
const { validateReview, isLoggedin, isAuthorR } = require('../middleware.js');
const review = require('../controller/review');

router.post('/new', isLoggedin, validateReview, wrapAsync(review.new));

router.delete('/:reviewId', isLoggedin, isAuthorR, wrapAsync(review.delete));

module.exports = router;