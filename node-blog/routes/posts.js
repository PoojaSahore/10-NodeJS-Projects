var express = require('express');
var router = express.Router();
//var sanitizeHtml = require('sanitize-html');
var multer = require('multer')
var upload = multer({dest: './public/uploads/images/'})
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
//var ObjectID = require('mongodb').ObjectID


router.get('/show/:id', function(req, res) {
    var posts = db.get('posts')
    //console.log(posts)
    posts.find({"_id": req.params.id}).then((post) => {console.log(post[0])
      res.render('show', {
        "post": post[0]
      })
    })
      .catch(e => {console.log(e)})
})

/* GET users listing. */
router.get('/add', function(req, res) {
  //var db = req.db
  var categories = db.get('categories')
  //console.log(categories)
  categories.find({}).then((categories) => {
    res.render('addpost', {
      'title': 'Add Post',
      categories
    });  
  })
    .catch(e => {console.log(e)})
})

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
    console.log(mainimage)
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
})

router.post('/addcomment', function(req, res) {
  var name = req.body.name
  var email = req.body.email
  var body = req.body.body
  var id = req.body.postid
  var commentDate = new Date()
  console.log(id)
  
  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required but never displayed').notEmpty();
  req.checkBody('email', 'Email is not formatted properly').isEmail();
  req.checkBody('body', 'Body field is required').notEmpty();

  var errors = req.validationErrors();

    if (errors) {
      var posts = db.get('posts')
      posts.find({"_id": id}).then((post) => {
        res.render('show', {
            errors,
            "post": post[0]
        })
      })
    } else {
        var comment = {
          name,
          email,
          body,
          commentDate
        }
        console.log(comment)
        var posts = db.get('posts')
        posts.update({"_id": id}, {$set: {"comments": comment}}, (err, doc) => {
          if(err)
            throw err
          else {
            req.flash('success', 'Comment Added!')
            res.location('/posts/show/'+id)
            res.redirect('/posts/show/'+id)
          }
        })
    }
})

module.exports = router;
