const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    head: {
        type: String,
        required: true,
        default: "New To-Do List"
    },
    description: {
        type: String,
        required: false
    },
    list: {
        type: Array,
        required: false,
        default: []
    },
    count: {
        type: Number,
        required: false,
        default: 0
    },
    color: {
        type: String,
        required: true,
        default: "#22c55e"
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    moderationDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('List', listSchema);
