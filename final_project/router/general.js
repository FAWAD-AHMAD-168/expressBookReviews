
const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();


// TASK 6: Register a new user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if username already exists
    const userExists = users.some(
        user => user.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (userExists) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    // Register new user
    users.push({
        username: username.trim(),
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });

});


// TASK 1: Get all books
public_users.get('/', function (req, res) {

    return res.status(200).json(books);

});


// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


// TASK 3: Get books based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
    const keys = Object.keys(books);
    const filtered_books = [];

    keys.forEach((key) => {

        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            filtered_books.push(books[key]);
        }

    });

    return res.status(200).json(filtered_books);

});


// TASK 4: Get books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
    const keys = Object.keys(books);
    const filtered_books = [];

    keys.forEach((key) => {

        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            filtered_books.push(books[key]);
        }

    });

    return res.status(200).json(filtered_books);

});


// TASK 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


module.exports.general = public_users;
