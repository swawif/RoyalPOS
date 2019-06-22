//Bismillahirahmanirahim
//Dependencies
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    config          = require('./config.json');
    //DB Models - if needed

//Connect to mongoDB
mongoose.connect("mongodb://localhost/rjd_pos_alpha", {useNewUrlParser:true});

//===== App Config ======
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
//Passport Config - later
/*
app.use(require('express-session')({
    secret: "",
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

// Seeder - for later uses

//==================================================
//============== ROUTES ============================
//==================================================

// INDEX - Universal Login Page
app.get('/',function (req,res) {
   res.render('login');
});

// INDEX - Admin Page
app.get('/admin',function (req,res) {
   res.send("ADMIN PAGE")
});


//404 Handler
app.get('/*',function (req,res) {
   res.send("404, not found!")
});

var port = 3000;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});