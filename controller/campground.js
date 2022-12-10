const { cloudinary } = require('../cloudinary');
const campGround = require('../model/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const camp = await campGround.find({});
    res.render('campground/index', { camp })
};

module.exports.renderNew = (req, res) => {
    res.render('campground/new');
}

module.exports.makeCamp = async (req, res, next) => {
    // if (!req.body.campground) throw new routerError('Invalid data', 404);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send()
    const newCamp = new campGround(req.body.camp);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Created Successfully!');
    res.redirect(`/campground/${newCamp._id}`);
};

module.exports.detail = async (req, res) => {
    const camp = await campGround.findById(req.params.id).populate({
        path: 'review',
        populate: { path: 'author' }
    }).populate('author');
    if (!camp) {
        req.flash('err', 'Oops! Campground not found ...');
        return res.redirect('/campground');
    }
    res.render('campground/campDetail', { camp });
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await campGround.findById(id);
    if (!camp) {
        req.flash('err', 'Oops! Campground not found ...');
        return res.redirect('/campground');
    }
    res.render('campground/edit', { camp })
};

module.exports.update = async (req, res) => {
    const camp = await campGround.findByIdAndUpdate(req.params.id, req.body.camp);
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.image.push(...img);
    await camp.save();
    if (req.body.deleteImage) {
        for (let file of req.body.deleteImage) {
            await cloudinary.uploader.destroy(file);
        }
        await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } });
    }
    req.flash('success', 'Update Successfully!');
    res.redirect(`/campground/${camp._id}`);
};

module.exports.delete = async (req, res) => {
    const camp = await campGround.findByIdAndDelete(req.params.id);
    req.flash('success', 'Delete Successfully!');
    res.redirect('/campground');
}