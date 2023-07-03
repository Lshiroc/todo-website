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
    doneCount: {
        type: Number,
        required: false,
        default: 0
    },
    pendingCount: {
        type: Number,
        required: false,
        default: 0
    },
    undoneCount: {
        type: Number,
        required: false,
        default: 0
    },
    color: {
        type: String,
        required: true,
        default: "#22c55e"
    },
    userID: {
        type: String,
        required: true
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
