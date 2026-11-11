
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// Check whether username already exists
const isValid = (username) => {
    return users.some(
        user => user.username.toLowerCase() === username.trim().toLowerCase()
    );
};


// Check whether username and password match
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username.toLowerCase() === username.trim().toLowerCase() &&
                user.password === password
    );
};


// TASK 7: Login as a registered user
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Authenticate registered user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
        { username: users.find(
            user => user.username.toLowerCase() === username.trim().toLowerCase()
        ).username },
        "access",
        { expiresIn: "1h" }
    );

    // Store JWT in session
    req.session.authorization = {
        accessToken: accessToken,
        username: username
    };

    return res.status(200).json({
        message: "User successfully logged in"
    });

});


// TASK 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;

    // Check whether review is provided
    if (typeof review !== 'string' || !review.trim()) {
        return res.status(400).json({
            message: "Please provide a review"
        });
    }

    // Check whether book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Get authenticated username from verified JWT
    const username = req.user.username;

    // Add or update review
    books[isbn].reviews[username] = review.trim();

    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: books[isbn].reviews
    });

});


// TASK 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    // Check whether book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Get authenticated username from verified JWT
    const username = req.user.username;

    // Check whether this user has posted a review
    if (!Object.prototype.hasOwnProperty.call(
        books[isbn].reviews, username
    )) {
        return res.status(404).json({
            message: "No review found for this user"
        });
    }

    // Delete only the logged-in user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review successfully deleted",
        reviews: books[isbn].reviews
    });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
