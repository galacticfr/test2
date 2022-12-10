const mongoose = require('mongoose');
const campGround = require('../model/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campGround.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campGround({
            author: "6263dd1a9b40d1b0f96a745f",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti dolorem autem, voluptas, unde doloribus mollitia dignissimos quo, illum explicabo asperiores temporibus quae magnam repudiandae! Ex hic repudiandae velit perspiciatis sit.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            image: [
                {
                    filename: 'YelpCamp/t2tgitygvyxtdps4uf6a',
                    url: 'https://res.cloudinary.com/dbcinxzvy/image/upload/v1650869873/YelpCamp/cdg2jmcwke3jjaurnofq.jpg',
                },
                {
                    filename: 'YelpCamp/h1r23p48kybc8cwxaksl',
                    url: 'https://res.cloudinary.com/dbcinxzvy/image/upload/v1651048279/YelpCamp/cjxz9lo5ccz1qbrzywvp.jpg',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})