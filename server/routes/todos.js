require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const List = require('./../models/list');
const currListStatistics = require('./../models/currListStatistics');

// Getting all
router.get('/', async (req, res) => {
    try {
        const lists = await List.find();
        res.json(lists);
    } catch (err) {
        res.status(500).json({message: err.message });
    }
})

// Getting List headers
router.post('/heads', authenticateToken, async (req, res) => {
    let lists;
    try {
        lists = await List.find({ userID: req.user.userID }).select('slug head description count color');
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Get List By SLUG
router.post('/:slug', authenticateToken, getList, async (req, res) => {
    try {
        const list = await res.list;
        res.status(200).json(res.list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Creating new list
router.post('/', authenticateToken, async (req, res) => {
    const list = new List({
        slug: req.body.slug,
        head: req.body.head,
        description: req.body.description,
        list: req.body.list,
        color: req.body.color,
        userID: req.body.userID
    });

    const statistic = new currListStatistics({
        userID: req.body.userID,
        slug: req.body.slug,
        done: req.body.done,
        pending: req.body.pending,
        undone: req.body.undone,
        date: new Date()
    })

    try {
        const newList = await list.save();
        const newStatistic = await statistic.save();
        res.status(201).json({"lol": newList});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// Deleting a List
router.delete("/:slug", authenticateToken, async (req, res) => {
    try {
        await List.deleteOne({ slug: req.params.slug });
        res.json({ message: "List deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Updating List
router.patch("/:slug", authenticateToken, getList, async (req, res) => {
    let newBody = {
        head: req.body.head,
        description: req.body.description,
    }

    let doneCount = 0;
    let pendingCount = 0;
    let undoneCount = 0;
    if(req.body.list) {
        newBody.list = [ ...req.body.list ];
        newBody.list.map((item) => {
            switch(item.status) {
                case "done":
                    doneCount++;
                    break;
                case "pending":
                    pendingCount++;
                    break;
                case "undone":
                    undoneCount++;
                    break; 
            }
        })
        newBody["doneCount"] = doneCount;
        newBody["pendingCount"] = pendingCount;
        newBody["undoneCount"] = undoneCount;
    }
    
    const prevStatistic = (await currListStatistics.find({ slug: req.params.slug }))[0];
    
    let newBody2 = {
        done: doneCount,
        pending: pendingCount,
        undone: undoneCount,
    }
    let prevDate = new Date(prevStatistic.date);
    let currentDate = new Date();

    if((currentDate.getHours() - prevDate.getHours()) <= 12) {
        newBody2.date = currentDate;
    }

    let newVersion = {...req.body, ...newBody ,moderationDate: Date.now()};
    try {
        const updatedList = await List.findOneAndUpdate({ slug: req.params.slug }, newVersion);
        const updatedStatistic = await currListStatistics.findOneAndUpdate({ slug: req.params.slug }, newBody2)
        res.json(updatedList);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Middleware
async function getList(req, res, next) {
    let list;
    try {
        list = await List.find({ slug: req.params.slug, userID: req.user.userID });
        if(list == null || list.length == 0) {
            return res.status(404).json({ message: "List could not be found", status: 404 });
        } 
    } catch(err) {
        console.log(err.message)
        return res.status(500).json({ message: err.message })
    }

    res.list = list;
    next();
}

// Creating slug
async function createSlug(n) {
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "q", "Q", "w", "W", "e", "E", "r", "R", "t", "T", "y", "Y", "u", "U", "i", "I", "o", "O", "p", "P", "a", "A", "s", "S", "d", "D", "f", "F", "g", "G", "h", "H", "j", "J", "k", "K", "l", "L", "z", 'Z', "x", "X", "c", "C", "v", "V", "b", "B", "n", "N", "m", "M"];
    let newSlug = "";
    for(let i = 0; i < n; i++) {
        newSlug += chars[Math.floor((chars.length - 1)*Math.random(1, chars.length))];
    }

    let checkList = await List.find({ slug: newSlug });
    if(checkList.length == 0) {
        return newSlug;
    }
    
    return createSlug(n);
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