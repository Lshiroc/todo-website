const express = require('express');
const router = express.Router();
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

// Register a user
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password,
        userID: await createID(11)
    })

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({message: err.message});
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


module.exports = router;