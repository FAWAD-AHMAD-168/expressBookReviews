
const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Base URL of the running Express server
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";


// ==========================================
// TASK 6: Register a new user
// ==========================================

public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const userExists = users.some(
        user => user.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (userExists) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username.trim(),
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });

});


// ==========================================
// TASK 1: Get all books
// ==========================================

public_users.get('/', function (req, res) {

    return res.status(200).json(books);

});


// ==========================================
// TASK 2: Get book details based on ISBN
// ==========================================

public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


// ==========================================
// TASK 3: Get books based on author
// ==========================================

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


// ==========================================
// TASK 4: Get books based on title
// ==========================================

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


// ==========================================
// TASK 5: Get book reviews based on ISBN
// ==========================================

public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


// ==========================================
// TASK 10: Get all books using Async/Await
// ==========================================

async function getAllBooks() {

    try {

        const response = await axios.get(`${BASE_URL}/`);

        return response.data;

    } catch (error) {

        throw error;

    }

}


// ==========================================
// TASK 11: Get book by ISBN using Promises
// ==========================================

function getBookByISBN(isbn) {

    return axios.get(
        `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
    )
    .then((response) => {

        return response.data;

    })
    .catch((error) => {

        throw error;

    });

}


// ==========================================
// TASK 12: Get books by Author using Promises
// ==========================================

function getBooksByAuthor(author) {

    return axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    )
    .then((response) => {

        return response.data;

    })
    .catch((error) => {

        throw error;

    });

}


// ==========================================
// TASK 13: Get books by Title using Async/Await
// ==========================================

async function getBooksByTitle(title) {

    try {

        const response = await axios.get(
            `${BASE_URL}/title/${encodeURIComponent(title)}`
        );

        return response.data;

    } catch (error) {

        throw error;

    }

}


// ==========================================
// EXPORT ROUTES AND ASYNC FUNCTIONS
// ==========================================

module.exports.general = public_users;

module.exports.bookQueries = {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};
