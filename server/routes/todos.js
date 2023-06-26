const express = require('express');
const router = express.Router();
const List = require('./../models/list');


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
router.get('/heads', async (req, res) => {
    let lists;
    try {
        lists = await List.find().select('slug head description');
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Get List By SLUG
router.get('/:slug', getList, async (req, res) => {
    try {
        const list = await res.list;
        res.status(200).json(res.list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Creating todo list
router.post('/', async (req, res) => {
    const list = new List({
        slug: await createSlug(8),
        head: req.body.head,
        description: req.body.description,
        list: req.body.list,
    });

    try {
        const newList = await list.save();
        res.status(201).json(newList);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// Deleting a List
router.delete("/:slug", async (req, res) => {
    try {
        await List.deleteOne({ slug: req.params.slug });
        res.json({ message: "List deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Updating List
router.patch("/:slug", getList, async (req, res) => {
    let newBody = {
        head: req.body.head,
        description: req.body.description,
        list: [
            ...req.body.list
        ],
    }

    let newVersion = {...req.body, moderationDate: Date.now()};
    try {
        const updatedList = await List.findOneAndUpdate({ slug: req.params.slug }, newVersion);
        res.json(updatedList);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Middleware
async function getList(req, res, next) {
    let list;
    try {
        list = await List.find({ slug: req.params.slug });
        if(list == null || list.length == 0) {
            return res.status(404).json({ message: "List could not be found", status: 404 });
        } 
    } catch(err) {
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

module.exports = router;