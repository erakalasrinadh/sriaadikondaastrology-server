const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("Error: MONGO_URI is not defined in .env file");
    process.exit(1);
}

console.log("--- Debugging MongoDB Connection ---");
// Mask password for display
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Target URI: ${maskedUri}`);

// Helper function to connect
const connectDB = async () => {
    console.log(`\nAttempting to connect with Mongoose...`);
    console.log(`Options: serverSelectionTimeoutMS: 5000, family: 4`);

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Fail relatively fast
            family: 4 // Force IPv4
        });
        console.log("✅ [SUCCESS] Connected to MongoDB successfully!");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ [ERROR] Mongoose Connection Failed:");
        console.error(`   Name: ${err.name}`);
        console.error(`   Message: ${err.message}`);

        if (err.reason) {
            console.error(`   Reason:`, err.reason);
        }

        console.log("\n--- Troubleshooting Guide ---");
        if (err.message.includes('querySrv')) {
            console.log("1. DNS ISSUE: The application could not resolve the MongoDB hostname.");
            console.log("   - Verify existing DNS settings or try a different network.");
            console.log("   - The hostname 'sriaadikondaastrology.hohzgli.mongodb.net' might be incorrect.");
        } else if (err.message.includes('ETIMEOUT')) {
            console.log("2. TIMEOUT / FIREWALL: The server did not respond.");
            console.log("   - CHECK ATLAS NETWORK ACCESS: Ensure your current IP is whitelisted (0.0.0.0/0 for testing).");
        } else if (err.message.includes('Authentication failed')) {
            console.log("3. AUTHENTICATION: Username or Password incorrect.");
        }

        process.exit(1);
    }
};

// 1. Extract hostname for DNS check
try {
    const hostname = uri.split('@')[1].split('/')[0];
    console.log(`\n1. Doing DNS Lookup for: ${hostname}`);
    console.log(`   (Checking SRV record: _mongodb._tcp.${hostname})`);

    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        console.log("   (Forced DNS servers to 8.8.8.8)");
    } catch (e) {
        console.log("   (Could not set custom DNS servers - ignoring)");
    }

    dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
        if (err) {
            console.error(`❌ [DNS ERROR] Could not resolve SRV record: ${err.code}`);
            console.error(`   Message: ${err.message}`);
            console.log("   Trying connection anyway (driver might handle it differently)...");
        } else {
            console.log(`✅ [DNS SUCCESS] Resolved to:`);
            addresses.forEach(a => console.log(`   - ${a.name}:${a.port}`));
        }

        // Proceed to connect regardless of DNS result (sometimes local resolve fails but driver works?)
        connectDB();
    });
} catch (e) {
    console.log("Could not parse hostname for DNS check. Proceeding to direct connection...");
    connectDB();
}
