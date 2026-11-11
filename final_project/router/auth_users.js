
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check whether username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check whether username and password match
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username &&
                user.password === password
    );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    // Login implementation will be added in Task 7
    return res.status(300).json({
        message: "Yet to be implemented"
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Review implementation will be added in Task 8
    return res.status(300).json({
        message: "Yet to be implemented"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
