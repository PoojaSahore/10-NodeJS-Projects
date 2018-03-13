var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res) {
    res.render('addcategory', {
      'title': 'Add Category'
    });  
});

router.post('/add', function(req, res) {
  var name = req.body.title

  // Form validation
  req.checkBody('title', 'The field is required').notEmpty();
    
  var errors = req.validationErrors();

    if (errors) {
        res.render('addcategory', {
            errors,
            name
        });
    } else {
        var categories = db.get('categories');

        // Submit to database
        categories.insert({
            "name": name,
        }, function(err, category) {
            if (err) {
                res.send('There was an issue submitting the category');
            } else {
                req.flash('success', 'Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
