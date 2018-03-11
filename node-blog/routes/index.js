var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
var db = require('monk')('localhost:27017/nodeblog')

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db
  var posts = db.get('posts')
  //console.log(posts)
  posts.find({}).then((posts) => {
    res.render('index', {posts})
  })
    .catch(e => {console.log(e)});
})

module.exports = router;
//pooja:hello@ds153352.mlab.com:53352/todo1