const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require("path");

const app = express();
mongoose.connect('mongodb+srv://tara:'+process.env.MONGO_PWD+'.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=> {
    console.log('connected to database!');
  })
  .catch(()=>{
    console.log('database connection failed');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
