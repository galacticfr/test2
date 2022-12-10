const campGround = require('./model/campground');
const Review = require('./model/review');
const AppError = require('./util/error');
const { reviewSchema, campgroundSchema } = require('./validate.js');

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('err', 'You must log in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campGround.findById(id);
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('err', 'Unauthorized');
        res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isAuthorR = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash('err', 'Unauthorized');
        res.redirect(`/campground/${req.params.id}`);
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new AppError(msg, 400)
    } else {
        next();
    }
}