require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 8000;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
app.use(express.json());
app.use(cors({
    origin: "https://todo-website-zeta.vercel.app",
}));

const todosRouter = require('./routes/todos');
app.use('/todos', todosRouter);

app.use(cors({
    origin: "https://todo-website-zeta.vercel.app",
}));

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.use(cors({
    origin: "https://todo-website-zeta.vercel.app",
}));

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const statisticsRouter = require('./routes/statistics');
app.use('/statistics', statisticsRouter);

app.use(cors({
    origin: "https://todo-website-zeta.vercel.app",
}));

app.listen(PORT, () => console.log(`Server is up on http://127.0.0.1:${PORT}`));