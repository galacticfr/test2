const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    filename: String,
    url: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100,w_175');
})

const campgroundSchema = new Schema({
    title: String,
    image: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ 1location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);



campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campground/${this.id}"><b>${this.title}</b></a><div>${this.location}</div>`;
})

campgroundSchema.post('findOneAndDelete', async function (campp) {
    if (campp) {
        await Review.deleteMany({ _id: { $in: campp.review } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);
