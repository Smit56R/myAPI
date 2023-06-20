const mongoose = require('mongoose')

const developerSchema = mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    apiKey: {
        type: String,
        default: '',
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    usage: {
        date: { type: Date, default: Date.now(), },
        count: { type: Number, default: 0 }
    },
    updatedOn: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Developer', developerSchema)