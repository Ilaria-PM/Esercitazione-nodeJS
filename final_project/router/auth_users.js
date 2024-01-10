const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return username.length >= 3;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        const newReview = req.query.review;
        // If the review has changed, update the book's review
        if (newReview) {
            book.reviews = {newReview};
            res.send(`Review for book with ISBN ${isbn} added/updated.`);
        } else {
            res.status(400).send("Review parameter is missing.");
        }
    } else {
        res.status(404).send("Book with the specified ISBN not found.");
    }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ error: 'Libro non trovato.' });
    }

    // Controllare se ci sono recensioni associate al libro
    if (Object.keys(book.reviews).length === 0) {
        return res.status(404).json({ error: 'Nessuna recensione associata a questo libro.' });
    }
    // Rimuovere tutte le recensioni associate al libro
    book.reviews = {};

    return res.status(200).json({ message: `Review for book with ISBN ${isbn} posted by user test deleted.` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
