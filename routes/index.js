var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res) {
  res.send({
      message: "API for grailz account"
  });
});

router.post('/user', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            req.send({
                error: err
            })
        }
        if (user) {
            res.send({
                error: "Email Already exist"
            })
        }
        var newUser = new User({
            username: username,
            email: email,
            password: password
        });
        newUser.save().then(res.send({
            result: "success"
        }))
    })
});

router.get('/user', function (req, res) {
    User.findOne({ username: req.query.username }, function (err, user) {
        if (err) {
            res.send({
                error: err
            })
        }
        if (user) {
            res.send({
                username: user.username,
                history: user.viewHistory,
                watchlist: user.watchlist
            })
        }
    })
});

router.post('/watchlist/', function (req, res) {
    var username = req.body.username;
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            req.send({
                error: err
            })
        }
        if (user) {
            user.watchlist.push({
                product_id: req.body.product_id,
                date: req.body.date,
                title: req.body.title,
                image: req.body.image,
                release: req.body.release
            });
            user.save().then(function () {
                res.send({
                    result: "success"
                })
            }, function (err) {
                res.send({
                    error: err
                })
            });
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});

router.get('/watchlist', function (req, res) {
    User.findOne({ username: req.query.username }, function (err, user) {
        if (err) {
            req.send({
                error: err
            })
        }
        if (user) {
            res.send(user.watchlist)
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});

router.delete('/watchlist', function (req, res) {
    var username = req.query.username;
    var id = req.query.id;
    var found = false;
    User.findOne({ username: username }, function (err, user) {
        if (err) { req.send({ error: err }) }
        if (user) {
            for (var i = 0; i < user.watchlist.length; i++) {
                if (user.watchlist[i].product_id === id) {
                    found = true;
                    user.watchlist.splice(i, 1);
                    user.save().then(res.send({result: "success"}))
                }
            }
            if (!found) {
                res.send({ error: "ID not found" })
            }
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});

router.post('/history', function (req, res) {
    var username = req.body.username;
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            req.send({
                error: err
            })
        }
        if (user) {
            user.viewHistory.push({
                product_id: req.body.product_id,
                title: req.body.title,
                image: req.body.image
            });
            user.save().then(function () {
                res.send({
                    result: "success"
                })
            }, function (err) {
                res.send({
                    error: err
                })
            });
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});

router.get('/history/', function (req, res) {
    User.findOne({ username: req.query.username }, function (err, user) {
        if (err) {
            req.send({
                error: err
            })
        }
        if (user) {
            res.send(user.viewHistory)
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});

router.delete('/history', function (req, res) {
    var username = req.query.username;
    var id = req.query.id;
    var found = false;
    User.findOne({ username: username }, function (err, user) {
        if (err) { req.send({ error: err }) }
        if (user) {
            for (var i = 0; i < user.viewHistory.length; i++) {
                if (user.viewHistory[i].product_id === id) {
                    found = true;
                    user.viewHistory.splice(i, 1);
                    user.save().then(res.send({result: "success"}))
                }
            }
            if (!found) {
                res.send({ error: "ID not found" })
            }
        } else {
            res.send({
                error: "Username not found"
            })
        }
    })
});



router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ email: email }, function (err, user) {
      if (err) {
          req.send({
              error: err
          })
      }
      if (user) {
          if (user.password === password) {
              return res.send({
                  result: "success",
                  username: user.username
              })
          } else {
              return res.send({
                  result: "failed",
                  error: "Password incorrect!"
              })
          }
      } else {
          res.send({
              error: "Email not found",
              email_received: email,
              password_received: password
          })
      }
  })
});

module.exports = router;
