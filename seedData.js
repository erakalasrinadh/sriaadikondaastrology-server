const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.log("Could not set custom DNS servers");
}

const Admin = require('./models/Admin');
const Service = require('./models/Service');
const GalleryItem = require('./models/GalleryItem');
const Testimonial = require('./models/Testimonial');

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

const galleryImages = [
    { image: '/assets/Gallery/C1.jpeg', caption: 'Gallery Image 1' },
    { image: '/assets/Gallery/C2.jpeg', caption: 'Gallery Image 2' },
    { image: '/assets/Gallery/C3.jpeg', caption: 'Gallery Image 3' },
    { image: '/assets/Gallery/C5.jpeg', caption: 'Gallery Image 5' },
    { image: '/assets/Gallery/C6.jpeg', caption: 'Gallery Image 6' },
    { image: '/assets/Gallery/C7.jpeg', caption: 'Gallery Image 7' },
    { image: '/assets/Gallery/C8.jpeg', caption: 'Gallery Image 8' },
    { image: '/assets/Gallery/C9.jpeg', caption: 'Gallery Image 9' },
    { image: '/assets/Gallery/C10.jpeg', caption: 'Gallery Image 10' },
    { image: '/assets/Gallery/C11.jpeg', caption: 'Gallery Image 11' },
    { image: '/assets/Gallery/C12.jpeg', caption: 'Gallery Image 12' },
    { image: '/assets/Gallery/C13.jpeg', caption: 'Gallery Image 13' },
    { image: '/assets/Gallery/C14.jpeg', caption: 'Gallery Image 14' },
    { image: '/assets/Gallery/C15.jpeg', caption: 'Gallery Image 15' },
    { image: '/assets/Gallery/C16.jpeg', caption: 'Gallery Image 16' },
];

const testimonialsList = [
    {
        name: "Ramesh Gupta",
        quote: "Sri Aadikonda's predictions were spot on! His remedies helped me overcome a difficult phase in my business.",
        rating: 5,
        image: ""
    },
    {
        name: "Sunita Reddy",
        quote: "We consulted him for our daughter's marriage compatibility. Very knowledgeable and patient.",
        rating: 5,
        image: ""
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4, // Force IPv4
        });
        console.log('MongoDB Connected to Remote...');

        // 1. Seed Admin
        let admin = await Admin.findOne({ username: 'Devadas' });
        if (!admin) {
            // Check for old admin and rename if exists, otherwise create new
            const oldAdmin = await Admin.findOne({ username: 'admin' });
            if (oldAdmin) {
                admin = oldAdmin;
                admin.username = 'Devadas';
                admin.password = 'Devadas@7'; // Will be hashed below
            } else {
                admin = new Admin({
                    username: 'Devadas',
                    password: 'Devadas@7'
                });
            }
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);
            await admin.save();
            console.log('Admin created.');
        } else {
            console.log('Admin already exists.');
        }

        // 2. Seed Services
        for (const service of servicesList) {
            const exists = await Service.findOne({ title: service.title });
            if (!exists) {
                await new Service(service).save();
                console.log(`Service added: ${service.title}`);
            }
        }
        console.log('Services seeded.');

        // 3. Seed Gallery
        for (const item of galleryImages) {
            const exists = await GalleryItem.findOne({ image: item.image });
            if (!exists) {
                await new GalleryItem(item).save();
                console.log(`Gallery Image added: ${item.image}`);
            }
        }
        console.log('Gallery seeded.');

        // 4. Seed Testimonials (Optional but good for completeness)
        for (const item of testimonialsList) {
            const exists = await Testimonial.findOne({ name: item.name });
            if (!exists) {
                await new Testimonial(item).save();
                console.log(`Testimonial added: ${item.name}`);
            }
        }
        console.log('Testimonials seeded.');

        console.log('ALL DAT SEEDED SUCCESSFULLY!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
