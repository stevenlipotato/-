const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    emails: [{
        type: String
    }],
    phones: [{
        type: String
    }],
    socialMedia: {
        facebook: String,
        linkedin: String,
        twitter: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
