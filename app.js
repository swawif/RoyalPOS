// بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
//TODOS
// Status Update : After click, button should be disabled to prevent multiple status update. (which did happened)
// Menu - Updating/Creating menu name will make previous stock invalid.
//          > change input system from using menu.name to instead use menu._id to make it future proof
//          > getStatusTable() > set NaN to 0
//          QuickFixes : Disable name edit

// MENU - Update -- TODO MAKE DUPLICATE PROTECTION
// /admin/setting/schemas
// make an auto whatsapp converter

//Dependencies
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    config          = require('./config.json'),
    methodOverride  = require('method-override'),
    router          = express.Router(),
    //Seeder
    seedDB          = require('./seed')

var indexLoginRoute = require('./routes/index-login'),
    adminRoute      = require('./routes/admin/index'),
    menuSetRoute    = require('./routes/admin/settings/menu'),
    orderRoute      = require('./routes/admin/order'),
    purchaseRoute   = require('./routes/admin/purchase')

//Connect to mongoDB
mongoose.connect("mongodb+srv://" + config.mongoUser + ":" + config.mongoPass + "@royal-pos-e6puk.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true});

//===== App Config ======
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
//Passport Config - later
/*
app.use(require('express-session')({
    secret: config.secret,
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

// Seeder
// seedDB();

//==================================================
//============== ROUTES ============================
//==================================================
app.use(indexLoginRoute);                       //Login Route
app.use("/admin", adminRoute);                  //Admin Index Route
app.use("/admin/settings/menu", menuSetRoute);  //Menu Setting Route
app.use("/admin/order", orderRoute);            //Order Page Route
app.use("/admin/purchase", purchaseRoute);      //Purchase Page Route

//404 Handler
app.get('/*',function (req,res) {
   res.send("404, not found!")
});

//Port Listener
var port = process.env.PORT || 8080;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});