const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/authors');
const { ensureAuthenticated } = require('../config/auth');



// const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMineType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
// const upload = multer({
//         dest: uploadPath,
//         fileFilter: (req, file, callback) => {
//             callback(null, imageMineType.includes(file.mimetype))
//         }
//     })
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, uploadPath)
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now()  + "-" + file.originalname)
//     }
// });  
// const upload = multer({ 
//     storage: uploadPath,
//     fileFilter: function (req, file, cb) {
//         console.log(file);
//         if(file.mimetype=="image/bmp"||file.mimetype=="image/png" ||file.mimetype=="image/jpg"||file.mimetype=="image/gif"||file.mimetype=="image/jpeg"){
//             cb(null, true)
//         }else{
//             return cb(new Error('Only image are allowed!'))
//         }
//     }
// }).single("cover");
//All Authors Route

router.get('/',ensureAuthenticated, async(req, res) => {

    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishBefore != null && req.query.publishBefore != '') {
        query = query.lte('publishDate', req.query.publishBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }

    // let searchOptions = {}
    // if (req.query.title != null && req.query.title != '') {
    //     searchOptions.title = new RegExp(req.query.title, 'i');
    // }
    // if (req.query.publishBefore != null && req.query.publishBefore != '') {
    //     query = query.lte('publishDate', new RegExp(req.query.publishBefore, 'i'));
    // }
    // if (req.query.publishAfter != null && req.query.publishAfter != '') {
    //     query = query.gte('publishDate', new RegExp(req.query.publishAfter, 'i'));
    // }
    // try {
    //     const books = await Book.find(searchOptions);
    //     res.render('books/index', { books: books, searchOptions: req.query });
    // } catch {
    //     res.redirect('/')
    // }
});
//New book route
router.get('/new', async(req, res) => {
    renderNewPage(res, new Book());
})

//Create Book Route
router.post('/', async(req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)

    } catch {
        renderNewPage(res, book, true)
    }
})

//delete book cover
// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }

//show Book Route
router.get('/:id', async(req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', {
            book: book
        })
    } catch {
        res.redirect('/')
    }
})

//Edit Book Route
router.get('/:id/edit', async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
})

//Update Book Route
router.put('/:id', async(req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (err) {
        console.log(err)
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            redirect('/')
        }
    }
})

//Delete Book Route

router.delete('/:id', async(req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.render('/books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }

    }
})

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

//     author.save((err,newAuthor)=>{
//     if(err){
//         res.render('authors/new',{
//             author:author,
//             errorMessage : 'Error creating Author'
//         })
//     }else{
//         res.redirect(`authors`);
//     }
//     })
//     res.send(req.body.name);
// })
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMineType.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Error Editing Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)

    } catch {
        res.redirect(`books`);
    }
}
module.exports = router;