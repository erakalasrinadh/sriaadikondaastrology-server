const express = require('express');
const router = express.Router();

// @route   POST api/contact
// @desc    Receive contact form submission
// @access  Public
router.post('/', (req, res) => {
    // In a real application, you might save this to DB or send an email.
    // For this project, we are primarily using WhatsApp, so this is just for the form logic if needed.
    console.log(req.body);
    res.json({ msg: 'Message received' });
});

module.exports = router;
