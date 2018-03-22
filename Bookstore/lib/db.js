'use strict'

var mongoose = require('mongoose')
var db = function() {
    return {
        config: function(conf) {
            mongoose.connect('mongodb://localhost/tekbooks')
            var db = mongoose.connection
            db.on('err', console.error.bind(console, 'Connection error'))
            db.once('open', function() {
                console.log('DB Connection Open...')
            })
        }
    }
}

module.exports = db()
