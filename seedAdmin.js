const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Updated to require directly
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');

        // Check if admin exists
        let admin = await Admin.findOne({ username: 'Devadas' });
        if (admin) {
            console.log('Admin already exists');
            // If exists, just reset password or notify
            console.log('Username: Devadas');
            console.log('Password: Devadas@7');
            process.exit();
        }

        // Create new admin
        admin = new Admin({
            username: 'Devadas',
            password: 'Devadas@7'
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);

        await admin.save();
        console.log('Admin created successfully');
        console.log('Username: admin');
        console.log('Password: password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
