//Bismillahirahmanirahim
//Dependencies
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    config          = require('./config.json'),
    methodOverride  = require('method-override'),
    //DB Models
    Menu            = require('./models/menu'),     // Menu DB
    Order           = require('./models/order'),    // Incoming sales order DB
    Purchase        = require('./models/purchase'), // Upcoming Purchases DB
    //Seeder
    seedDB          = require('./seed');

//Connect to mongoDB
mongoose.connect("mongodb://localhost/rjd_pos_alpha", {useNewUrlParser:true});

//===== App Config ======
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
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
    Menu.find({}, (err,menus)=>{
        if(err){console.log(err);} else{
            res.render('admin/index', {menus:menus});
            console.log("Admin Page");
        }
    });
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
    console.log(req.body.menu);
    Menu.findOne({
        name: name
    }, (err, foundMenu) => {
        if(err){console.log(err);} else {
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

// Show/Edit
app.get('/admin/menu/:id/edit',function (req,res) {
    Menu.findById(req.params.id, function(err,menu) {
        if(err){console.log(err); res.redirect('/admin/menu');} else {
            console.log("Editing menu : " + menu.name);
            res.render('admin/editMenu', {menu:menu});
        }
    });
});

// Update -- TODO MAKE DUPLICATE PROTECTION
app.put('/admin/menu/:id',function (req,res) {
    Menu.findByIdAndUpdate(req.params.id, req.body.menu, {new: true}, (err,newMenu) => {
        if(err){
            console.log(err);
        } else {
            console.log("Updated Menu!");
            console.log(newMenu);
            res.redirect('/admin/menu');
        }
    });
});

// Destroy
app.delete('/admin/menu/:id',function (req,res) {
    Menu.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log(err);
        } else {
            console.log("Deleted menu : " + req.params.id);
            res.redirect('/admin/menu');
        }
    })
});


//========= ORDER ROUTE ============================
//INDEX - Show all orders
app.get('/admin/order/',function (req,res) {
    Order.find({},(err, orders)=>{
        if(err){console.log(err)} else {
            Menu.find({},(err,menus)=>{
                if(err){console.log(err)} else {
                    res.render('admin/orderIndex', {orders:orders, menus:menus});
                }
            });
        }
    });
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
    var orderDetail = req.body.orderDetail;
    var newOrderObj = req.body.order;
    newOrderObj.orderDetail = orderDetail;
    Order.create(newOrderObj, function(err, newOrder){
        if(err){console.log(err);} else {
            console.log("new order!");
            console.log(newOrder);
            res.redirect('/admin/order');
        }
    });
});

//SHOW
app.get('/admin/order/:id',function (req,res) {
    Order.findById(req.params.id, (err, order) =>{
        if(err){console.log(err);}else{
            Menu.find({}, (err, menus)=>{
                if(err){console.log(err);}else{
                    res.render('admin/orderDetail', {order:order,menus:menus});
                }
            });
        }
    });
});


//EDIT
//UPDATE
//DESTROY

//========= PURCHASE ROUTE ============================
//INDEX
//NEW
//SUBMIT NEW
//SHOW
//EDIT
//UPDATE
//DESTROY


//404 Handler
app.get('/*',function (req,res) {
   res.send("404, not found!")
});

//Port Listener
var port = 3000;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});

/*NOTES
DB Model antara Menus dan Orders akan dipisah aja. 
mereka cuman terhubung pas ada transaksi terjadi
*/