const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({username, password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const results = [];
  keys.forEach(key => {
    if (books[key].author === author) {
      results.push(books[key]);
    }
  });
  return res.status(200).send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const results = [];
  keys.forEach(key => {
    if (books[key].title === title) {
      results.push(books[key]);
    }
  });
  return res.status(200).send(results);
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});


// Task 10: async get all books
public_users.get('/async', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Task 11: async get book by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).send(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Task 12: async get book by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return res.status(200).send(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// async get book by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).send(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

module.exports.general = public_users;