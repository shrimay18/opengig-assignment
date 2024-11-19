const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum:['pending','completed','dropped'],
        default:'pending'
    },
    startedAt:{
        type: Date,
        default: Date.now
    }
})

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;