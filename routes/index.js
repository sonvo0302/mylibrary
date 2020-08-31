// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');

// module.exports = router;
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Book=require('../models/book');

// router.get('/', async(req, res) => {
//     let books
//     try {
//         books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
//     } catch {
//         books = []
//     }
//     res.render('index', { books: books })
// });

// Welcome Page


router.get('/home', ensureAuthenticated, async(req, res) =>{
let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
    } catch {
        books = []
    }
    res.render('index', { books: books,  user: req.user })
});
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));


    

module.exports = router;