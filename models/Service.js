const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // Storing icon name or URL
        required: true,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
