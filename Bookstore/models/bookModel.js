'use strict'

var mongoose = require('mongoose')

var bookModel = function() {
    var bookSchema = mongoose.Schema({
        title: String,
        category: String,
        author: String,
        description: String,
        publisher: String,
        price: Number,
        cover: String,
    })
    return mongoose.model('Book',  bookSchema)
}

module.exports = new bookModel()
