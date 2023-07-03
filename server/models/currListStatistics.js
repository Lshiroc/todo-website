const mongoose = require('mongoose');

const currListStatisticsSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    done: {
        type: Number,
        required: true,
        default: 0
    },
    pending: {
        type: Number,
        required: true,
        default: 0
    },
    undone: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('currListStatistics' ,currListStatisticsSchema);