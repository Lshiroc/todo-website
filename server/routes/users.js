require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

// Getting all the users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Login User
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userLogin = await User.find({ username: username, password: password });
    if(userLogin.length == 0) return res.sendStatus(404);
    
    const userID = userLogin[0].userID;
    const user = { userID: userID };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {});
    res.status(200).json({ accessToken: accessToken, userID: userID });
})

// Register a user
router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password,
        userID: await createID(11),
    })

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Check Token
router.post('/verifytoken', authenticateToken, async (req, res) => {
    const token = req.body.token;
    
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Creating ID
async function createID(n) {
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "q", "Q", "w", "W", "e", "E", "r", "R", "t", "T", "y", "Y", "u", "U", "i", "I", "o", "O", "p", "P", "a", "A", "s", "S", "d", "D", "f", "F", "g", "G", "h", "H", "j", "J", "k", "K", "l", "L", "z", 'Z', "x", "X", "c", "C", "v", "V", "b", "B", "n", "N", "m", "M"];
    let newID = "";
    for(let i = 0; i < n; i++) {
        newID += chars[Math.floor((chars.length - 1)*Math.random(1, chars.length))];
    }

    let checkUser = await User.find({ slug: newID });
    if(checkUser.length == 0) {
        return newID;
    }
    
    return createID(n);
}

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