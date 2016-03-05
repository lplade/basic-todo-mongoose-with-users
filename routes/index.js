var express = require('express');
var passport = require('passport');

var router = express.Router();

/* Home page. User should sign in. */
router.get('/', function(req, res, next) {

  res.render('authenticate', {
    loginMessage : req.flash('login'),
    createAcctMessage : req.flash('signup') } );

});


router.post('/login', passport.authenticate('local-login', {
  successRedirect : "/tasks",
  failureRedirect : "/",
  failureFlash : true
}));


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/tasks',
  failureRedirect : '/',
  failureFlash : true
}));


router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/')
});


module.exports = router;


