const Review = require('../model/review');
const campGround = require('../model/campground');

module.exports.new = async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Your review is live!');
    res.redirect(`/campground/${campground._id}`);
};

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Delete Successfully!');
    res.redirect(`/campground/${id}`);
};