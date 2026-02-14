const mongoose = require('mongoose');
require('dotenv').config();
const GalleryItem = require('./models/GalleryItem');

// filenames: C1.jpeg to C16.jpeg
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

const seedGallery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');

        // Check for existing items to avoid duplicates
        const count = await GalleryItem.countDocuments();

        if (count > 0) {
            console.log('Gallery items already exist. Checking individually.');
            for (const item of galleryImages) {
                const exists = await GalleryItem.findOne({ image: item.image });
                if (!exists) {
                    await new GalleryItem(item).save();
                    console.log(`Added image: ${item.image}`);
                } else {
                    console.log(`Image already exists: ${item.image}`);
                }
            }
        } else {
            await GalleryItem.insertMany(galleryImages);
            console.log('All gallery images seeded successfully.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedGallery();
