//Bismillahirahmanirahim
//Dependencies
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    config          = require('./config.json'),
    //DB Models
    Menu            = require('./models/menu'),
    Order           = require('./models/order'),
    //Seeder
    seedDB          = require('./seed');

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
seedDB();

//==================================================
//============== ROUTES ============================
//==================================================

// INDEX - Universal Login Page
app.get('/',function (req,res) {
   res.render('login');
});

// INDEX - Admin Page
app.get('/admin',function (req,res) {
   res.render('admin/index');
});

// INDEX - Menu List Page
app.get('/admin/menu',function (req,res) {
    Menu.find({},function(err, menus){
        if(err){
            console.log(err);
        } else {
            res.render('admin/menu', {menus:menus});
        }
    });
});

// NEW - Submit New Menu
app.get('/admin/menu/new',function (req,res) {
   res.render('admin/newMenu');
});

// POST - Process new menu into DB
app.post('/admin/menu',function (req,res) {
    Menu.create(req.body.menu, function(err,newMenu){
        if(err){
            console.log(err);
        } else {
            console.log("New Menu : " + req.body.menu.name);
            res.redirect('/admin/menu');
        }
   });
});

app.get('/admin/order/new',function (req,res) {
   res.render('admin/newOrder');
});


//404 Handler
app.get('/*',function (req,res) {
   res.send("404, not found!")
});

var port = 3000;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});

/*NOTES
DB model would be
setiap rasa punya entrynya sendiri di db.menus

Kemudian, setiap kali ada order masuk atau keluar, jumlahnya akan mempengaruhi jumlah
db.menus.stock

kemudian untuk membuat histori order, kita bisa gunakan association dari db.menus ke
db.orders

*/