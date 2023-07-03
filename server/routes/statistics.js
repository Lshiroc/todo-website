require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const currListStatistics = require('./../models/currListStatistics');

// Setting initial statistic 
router.post('/create', authenticateToken, async (req, res) => {
    const statistic = new currListStatistics({
        userID: req.user.userID,
        slug: req.body.slug,
        done: req.body.done,
        pending: req.body.pending,
        undone: req.body.undone,
        date: new Date()
    })
    
    try {
        const newStatistic = await statistic.save();
        res.status(201).json(newStatistic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Updating statistic
router.patch('/update/:slug', authenticateToken, async (req, res) => {
    let newBody = {
        done: req.body.done,
        pending: req.body.pending,
        undone: req.body.undone,
        date: new Date()
    }

    try {
        const updatedStatistic = await currListStatistics.findOneAndUpdate({ slug: req.params.slug }, newBody)
        res.status(201).json(updatedStatistic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Getting all Statistics
router.get('/', async (req, res) => {
    try {
        const statistic = await currListStatistics.find();
        res.status(200).json(statistic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// JWT Authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: err.message});
        req.user = user;
        next();
    });
}

module.exports = router;
