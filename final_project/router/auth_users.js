const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // check if username is NOT already used
    let usersWithSameName = users.filter((user) => user.username === username);
    return usersWithSameName.length === 0;
  }
  
  const authenticatedUser = (username,password)=>{ //returns boolean
    // check if username/password match
    let validUsers = users.filter((user) => (user.username === username && user.password === password));
    return validUsers.length > 0;
  }
  
  //only registered users can login
  regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = { accessToken, username };
      return res.status(200).json({message: "User successfully logged in"});
    }
  
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  });
  
  // Add a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review added/updated successfully"});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  });


  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (books[isbn] && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    }
    return res.status(404).json({message: "Review not found"});
  });

  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
