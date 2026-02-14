const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const auth = require('../middleware/auth');

// @route   GET api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const galleryItems = await GalleryItem.find();
        res.json(galleryItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/gallery
// @desc    Add new gallery item
// @access  Private
router.post('/', auth, async (req, res) => {
    const { image, caption } = req.body;

    try {
        const newGalleryItem = new GalleryItem({
            image,
            caption,
        });

        const galleryItem = await newGalleryItem.save();
        res.json(galleryItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/gallery/:id
// @desc    Delete gallery item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let galleryItem = await GalleryItem.findById(req.params.id);

        if (!galleryItem) return res.status(404).json({ msg: 'Gallery item not found' });

        if (galleryItem.image && !galleryItem.image.startsWith('http')) {
            const filePath = path.join(__dirname, '../..', galleryItem.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await GalleryItem.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Gallery item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
