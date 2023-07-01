const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

router.post('/', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
})

router.get('/lists', (req, res) => {
    
})



module.exports = router;