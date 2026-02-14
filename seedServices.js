const mongoose = require('mongoose');
require('dotenv').config();
const Service = require('./models/Service');

const servicesList = [
    {
        title: 'Janma Kundali Analysis',
        description: 'Detailed analysis of your birth chart to uncover your life path, strengths, and challenges.',
        icon: 'FaStar',
        image: ''
    },
    {
        title: 'Marriage Compatibility',
        description: 'Ensure a harmonious married life with comprehensive horoscope matching (Guna Milan).',
        icon: 'FaHeart',
        image: ''
    },
    {
        title: 'Career & Finance',
        description: 'Get guidance on the right career path, job changes, and financial growth opportunities.',
        icon: 'FaBriefcase',
        image: ''
    },
    {
        title: 'Vastu Consultation',
        description: 'Harmonize your living and workspace with Vastu Shastra principles for prosperity.',
        icon: 'FaHome',
        image: ''
    },
    {
        title: 'Dosha Nivarana',
        description: 'Effective remedies for Mangal Dosha, Kaal Sarp Dosha, and other planetary afflictions.',
        icon: 'FaHandHoldingHeart',
        image: ''
    },
    {
        title: 'Muhurtham Services',
        description: 'Find the most auspicious dates and times for weddings, housewarmings, and new ventures.',
        icon: 'FaRing',
        image: ''
    }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');

        // Clear existing services? Or just add if empty?
        // Let's check count first.
        const count = await Service.countDocuments();

        if (count > 0) {
            console.log('Services already exist. Checking if we should add more or if they match.');
            // For safety, let's just add if the title doesn't exist.
            for (const service of servicesList) {
                const exists = await Service.findOne({ title: service.title });
                if (!exists) {
                    await new Service(service).save();
                    console.log(`Added service: ${service.title}`);
                } else {
                    console.log(`Service already exists: ${service.title}`);
                }
            }
        } else {
            await Service.insertMany(servicesList);
            console.log('All services seeded successfully.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedServices();
