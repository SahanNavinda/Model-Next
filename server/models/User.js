const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: 'model' }, // 'model' or 'client'
    isVerified: { type: Boolean, default: false },
    profileImage: String,
    stats: {
        height: String,
        waist: String,
        shoes: String,
        profileCompletion: Number
    }
});

module.exports = mongoose.model('User', UserSchema);