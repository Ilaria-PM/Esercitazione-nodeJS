const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {

        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    } 
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

//-------------------------------------------------------
//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
        books;
    resolve(Object.values(books)); 
})  

//Call the promise and wait for it to be resolved and then print a message.
myPromise.then((successMessage) => {
    console.log("From Callback ")
    successMessage.forEach((book) => {
        console.log(book);
});
})

//-------------------------------------------------------

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const requestedISBN = req.params.isbn;
  
    // Cerca il libro utilizzando l'ISBN fornito come chiave
    const book = books[requestedISBN];
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Libro non trovato" });
    }
  });
  
   //------------------------------------------------

   const searchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const foundBook = books[isbn];
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found.`));
      }
    });
  }
  
  const isbnToSearch = 1; // Assuming 1 is the ISBN you want to search
  searchBookByISBN(isbnToSearch)
    .then((foundBook) => {
      console.log("Book found:", foundBook);
    })
    .catch((error) => {
      console.error(error.message);
    });
  
//------------------------------------------    
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
  
    // Cerca i libri dell'autore fornito
    const matchingBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === requestedAuthor.toLowerCase()
    );
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Nessun libro trovato dell'autore fornito" });
    }
  });
  
//---------------------------------------------
const searchBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
  const foundBooks = Object.values(books).filter((book) => 
  book.author.toLowerCase() === author.toLowerCase());
  if (foundBooks.length > 0) {resolve(foundBooks);
   } else {
  reject(new Error(`Books by author ${author} not found.`));}});};

  const authorToSearch = "Dante Alighieri"; // Replace with the author you want to search
  
  searchBookByAuthor(authorToSearch).then((foundBooks) => {
      console.log(`Books by ${authorToSearch}:`, foundBooks);})
  .catch((error) => { 
  console.error(error.message); });  

//----------------------------------------------
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
  
    // Cerca il libro con il titolo fornito
    const matchingBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === requestedTitle.toLowerCase()
    );
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Nessun libro trovato con il titolo fornito" });
    }
  });

//--------------------------------------------------

const searchBookByTitle = (title) => {
  return new Promise((resolve, reject) => { 
  const foundBooks = Object.values(books).filter((book) => 
  book.title.toLowerCase() === title.toLowerCase());
  if (foundBooks.length > 0) {
  resolve(foundBooks); } else {
  reject(new Error(`Books with title ${title} not found.`)); }});}
  ;const titleToSearch = "The Divine Comedy"; // Replace with the title you want to search
  
  searchBookByTitle(titleToSearch) .then((foundBooks) => {
      console.log(`Books with title ${titleToSearch}:`, foundBooks); })
  .catch((error) => {console.error(error.message);});  

//--------------------------------------------------

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const requestedISBN = req.params.isbn;
  
    // Verifica se il libro con l'ISBN fornito esiste
    if (books[requestedISBN]) {
      const bookReviews = books[requestedISBN].reviews;
  
      return res.status(200).json({ reviews: bookReviews });
    } else {
      return res.status(404).json({ message: "Libro non trovato con l'ISBN fornito" });
    }
  });
  

module.exports.general = public_users;
