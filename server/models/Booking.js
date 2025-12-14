const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientName: String,
    jobType: String,
    date: String,
    status: { 
        type: String, 
        enum: ['NEW', 'PENDING', 'ACCEPTED', 'DECLINED'], 
        default: 'NEW' 
    },
    isEvent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Booking', BookingSchema);