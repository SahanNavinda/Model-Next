const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// ---------------------------------------------------------------------
// 1. GET MODEL DASHBOARD DATA
// Fetches:
// - "myBookings": Direct jobs for me OR jobs I applied for
// - "events": Public events open to everyone
// ---------------------------------------------------------------------
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        // 1. Fetch personal bookings (Direct requests or Applications)
        const myBookings = await Booking.find({ 
            modelId: req.params.userId, 
            isEvent: false 
        }).sort({ _id: -1 });

        // 2. Fetch Public Events (where modelId is null)
        // We use modelId: null to define "Public"
        const publicEvents = await Booking.find({ 
            isEvent: true,
            modelId: null 
        }).sort({ _id: -1 });

        res.json({ 
            profile: user, 
            bookings: myBookings, 
            events: publicEvents 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------
// 2. GET CLIENT DASHBOARD DATA
// Fetches:
// - "events": Events created by this client
// - "applications": Models who clicked "Apply" (Status = 'APPLIED')
// ---------------------------------------------------------------------
router.get('/client/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        // 1. Events I Created (Matched by my Name)
        const myEvents = await Booking.find({ 
            clientName: user.name, 
            isEvent: true 
        }).sort({ _id: -1 });
        
        // 2. Incoming Applications (Models applying to my jobs)
        // We find bookings with my clientName where status is 'APPLIED'
        const applications = await Booking.find({ 
            clientName: user.name, 
            status: 'APPLIED',
            isEvent: false 
        }).populate('modelId', 'name profileImage'); // Get Model's name & photo

        res.json({ 
            profile: user, 
            events: myEvents, 
            applications: applications 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------
// 3. CREATE BOOKING / EVENT / APPLICATION
// Handles:
// - Client creating a Public Event (modelId: null)
// - Model clicking "Apply" (status: 'APPLIED')
// ---------------------------------------------------------------------
router.post('/booking', async (req, res) => {
    try {
        const { clientName, jobType, date, modelId, isEvent, status } = req.body;
        
        const newBooking = await Booking.create({
            clientName, 
            jobType, 
            date,
            modelId: modelId || null, // Null = Public Event
            status: status || 'NEW',  // 'NEW' (Created by Client) or 'APPLIED' (Model Applied)
            isEvent: isEvent || false 
        });

        res.json(newBooking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------
// 4. UPDATE STATUS (APPROVE / DECLINE)
// Handles:
// - Client approving an application ('CONFIRMED')
// - Model accepting a direct job ('ACCEPTED')
// ---------------------------------------------------------------------
router.put('/booking/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true } // Return the updated version
        );
        
        res.json(updatedBooking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;