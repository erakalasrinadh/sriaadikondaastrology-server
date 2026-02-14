const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
});

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
