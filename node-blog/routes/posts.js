var express = require('express');
var router = express.Router();
//var sanitizeHtml = require('sanitize-html');
var multer = require('multer')
var upload = multer({dest: './uploads'})
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res) {
  var db = req.db
  var categories = db.get('categories')
  //console.log(categories)
  categories.find({}).then((categories) => {
    res.render('addpost', {
      'title': 'Add Post',
      categories
    });  
  })
    .catch(e => {console.log(e)});
});

router.post('/add', upload.single('mainimage'), function(req, res) {
  var title = req.body.title
  var category = req.body.category
  var body = req.body.body
  var author= req.body.author
  var date = new Date()
  
  //check image upload
  if(req.file)
    var mainimage = req.file.filename
  else
    var mainimage = 'noimage.jpg'

  // Form validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

  var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            errors: errors,
            title,
            body
        });
    } else {
        var posts = db.get('posts');

        // Submit to database
        posts.insert({
            title,
            body,
            category,
            date,
            author,
            mainimage
        }, function(err, post) {
            if (err) {
                res.send('There was an issue submitting the post');
            } else {
                req.flash('success', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
