const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const Post = require("./models/post");

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to db")
})
.catch(() => {
  console.log("Failed to connect to db");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
  
});

app.get("/posts", (req, res, next) => {
  Post.find()
  .then(docs => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: docs
    });
  });
  
});

app.delete("/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(response => {
    console.log(response);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
  
});

module.exports = app;
