const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quote: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 5,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
