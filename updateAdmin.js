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

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        });
        console.log('MongoDB Connected...');

        // Find the existing admin
        let admin = await Admin.findOne({ username: 'admin' });

        if (admin) {
            console.log('Found admin user "admin". Updating...');
            admin.username = 'Devadas';
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('Devadas@7', salt);
            await admin.save();
            console.log('Admin credentials updated successfully to: Devadas / Devadas@7');
        } else {
            // Check if already updated
            const newAdmin = await Admin.findOne({ username: 'Devadas' });
            if (newAdmin) {
                console.log('Admin "Devadas" already exists. Updating password just in case...');
                const salt = await bcrypt.genSalt(10);
                newAdmin.password = await bcrypt.hash('Devadas@7', salt);
                await newAdmin.save();
                console.log('Password updated for "Devadas".');
            } else {
                console.log('No admin found to update. Creating new admin "Devadas"...');
                const newAdmin = new Admin({
                    username: 'Devadas',
                    password: 'password123' // Temp, will be hashed
                });
                const salt = await bcrypt.genSalt(10);
                newAdmin.password = await bcrypt.hash('Devadas@7', salt);
                await newAdmin.save();
                console.log('New Admin "Devadas" created.');
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateAdmin();
