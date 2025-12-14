require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected for Seeding"))
.catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Booking.deleteMany({});

        // 1. Create Model
        const modelUser = await User.create({
            name: "Isabella Rossi",
            email: "isabella@modelnext.com",
            role: "model",
            isVerified: true,
            profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            stats: { height: "5' 9\"", waist: "24\"", shoes: "39 EU", profileCompletion: 75 }
        });

        // 2. Create Client (NAME MUST MATCH EVENTS BELOW)
        const clientUser = await User.create({
            name: "Vogue Agency", // <--- THIS NAME
            email: "contact@vogue.com",
            role: "client",
            isVerified: true,
            profileImage: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=300&q=80",
            stats: {}
        });

        // 3. Create Data
        await Booking.insertMany([
            // Matches "Vogue Agency"
            { modelId: modelUser._id, clientName: "Vogue Agency", jobType: "Summer Campaign", date: "Oct 25, 2024", status: "NEW", isEvent: false },
            
            // Public Event (Matches "Vogue Agency")
            { modelId: null, clientName: "Vogue Agency", jobType: "Open Casting Call", date: "Sept 30, 2024", status: "NEW", isEvent: true },
            
            // Another Public Event
            { modelId: null, clientName: "Vogue Agency", jobType: "Runway Auditons", date: "Oct 2, 2024", status: "NEW", isEvent: true }
        ]);

        console.log("Data Seeded.");
        console.log("------------------------------------------------");
        console.log("⚠️  MODEL ID:", modelUser._id.toString());
        console.log("⚠️  CLIENT ID:", clientUser._id.toString());
        console.log("------------------------------------------------");
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();