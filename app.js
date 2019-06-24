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
   console.log("login page");
});

// INDEX - Admin Page
app.get('/admin',function (req,res) {
   res.render('admin/index');
   console.log("Admin Page");
});

//========= MENU ROUTE =============================
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
    // Check if menu existed or not
    var name = req.body.menu.name.toLowerCase();
    Menu.findOne({
        name: name
    }, (err, foundMenu) => {
        if(err){console.log(err)} else {
            // If so, do not overwrite, render the newMenu page with error 
            if(foundMenu){
                // render the newMenu page with error (coming soon)
                // res.render('admin/newMenu', {err: "menuExisted"});
                res.redirect('/admin/menu')
                console.log("Menu Existed! : " + foundMenu.name + ", Canceling...");
            // If not, add the new menu to the 
            } else if (foundMenu === null) {
                Menu.create(req.body.menu, function(err,newMenu){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("New Menu : " + req.body.menu.name);
                        res.redirect('/admin/menu');
                    }
               });
            }
        }
    });
});

// Edit
// Update
// Destroy


//========= ORDER ROUTE ============================
//INDEX - Show all orders
app.get('/admin/order/',function (req,res) {
   res.render('admin/orderIndex');
});


//NEW - Submit New Order 
app.get('/admin/order/new',function (req,res) {
    Menu.find({}, function(err, menus){
        if(err){console.log(err);} else {
            res.render('admin/newOrder', {menus : menus});
            console.log("Adding new order...");
        }
    });
});

//CREATE
app.post('/admin/order',function (req,res) {
    var customerInfo = req.body.order;
    var orderDetail = req.body.orderDetail;
    res.send(customerInfo + orderDetail);
    console.log(customerInfo);
    console.log(orderDetail);
});

//SHOW
//EDIT
//UPDATE
//DESTROY


//404 Handler
app.get('/*',function (req,res) {
   res.send("404, not found!")
});

var port = 3000;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});

/*NOTES
DB Model antara Menus dan Orders akan dipisah aja. 
mereka cuman terhubung pas ada transaksi terjadi
*/