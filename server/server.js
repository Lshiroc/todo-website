// require('dotenv').config();

// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const PORT = 8000;

// mongoose.connect(process.env.DATABASE_URL);
// const db = mongoose.connection;
// db.on('error', (err) => console.error(err));
// // db.once('open', () => console.log("Connected to database"));

// app.use(express.json());

// const todosRouter = require('./routes/todos');
// app.use('/todos', todosRouter);

// app.listen(PORT, () => console.log(`Server has started on http://localhost:${PORT}`))




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

const todosRouter = require('./routes/todos');
app.use(cors());
app.use('/todos', todosRouter);

const usersRouter = require('./routes/users');
app.use(cors());
app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`Server is up on http://127.0.0.1:${PORT}`));