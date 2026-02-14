const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/services
// @desc    Add new service
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, icon, image } = req.body;

    try {
        const newService = new Service({
            title,
            description,
            icon,
            image,
        });

        const service = await newService.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/services/:id
// @desc    Update service
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, icon, image } = req.body;

    const serviceFields = {};
    if (title) serviceFields.title = title;
    if (description) serviceFields.description = description;
    if (icon) serviceFields.icon = icon;
    if (image) serviceFields.image = image;

    try {
        let service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ msg: 'Service not found' });

        service = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: serviceFields },
            { new: true }
        );

        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/services/:id
// @desc    Delete service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ msg: 'Service not found' });

        await Service.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Service removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
