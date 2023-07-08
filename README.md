# todo-website
Simple To Do website for tracking your daily tasks or to manage your tasks in projects

# Running in local
You need to install and set up [MongoDB Compass](https://www.mongodb.com/try/download/compass).
In MongoDB Compass run on local `mongodb://127.0.0.1:27017`.

In the `server` folder create `.env` file and set up these values:
```
DATABASE_URL=mongodb://127.0.0.1:8000:27017
ACCESS_TOKEN_SECRET=<random 64 character string>
```
Use `npm i` in both `client` and `server` to download neccessery npm packages.<br/>
Run `npm run dev` in `client` to run FrontEnd.
<br/>Run `npm run devStart` in `server` to run BackEnd.

That's it! You are up to go!