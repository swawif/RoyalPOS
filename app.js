// بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
//TODOS
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
    //DB Models
    Menu            = require('./models/menu'),         // Menu DB
    Order           = require('./models/order'),        // Incoming sales order DB
    OrderScheme     = require('./models/orderschema'),  // Order Type DB
    Purchase        = require('./models/purchase'),     // Upcoming Purchases DB
    PurchaseScheme  = require('./models/purchaseschema'), // Purchase Type DB
    //Seeder
    seedDB          = require('./seed'),
    //Helper
    getStatusTable  = require('./helper/functions');

var indexLoginRoute = require('./routes/index-login'),
    adminRoute      = require('./routes/admin/index'),
    menuSetRoute    = require('./routes/admin/settings/menu')

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

// INDEX - Universal Login Page
app.use(indexLoginRoute);

// Admin Index Page
app.use("/admin", adminRoute);

// Menu Settings route
app.use("/admin/settings/menu", menuSetRoute);

//========= ORDER ROUTE ============================

//INDEX - Show all orders
app.get('/admin/order/',function (req,res) {
    Order.find({},(err, orders)=>{
        if(err){console.log(err)} else {
            Menu.find({},(err,menus)=>{
                if(err){console.log(err)} else {
                    res.render('transactionPage/index', {datas:orders, menus:menus, transactionType:"order"});
                }
            });
        }
    });
});

//NEW - Submit New Order 
app.get('/admin/order/new',function (req,res) {
    Menu.find({}).exec()
        .then(menus => {
            Purchase.find({}).exec()
                .then(purchases => {
                    Order.find({}).exec()
                        .then(orders => {
                            OrderScheme.find({}).exec()
                                .then(schemas => {
                                    getStatusTable(menus, purchases, orders)
                                        .then(table => {
                                            res.render('transactionPage/new', {
                                                menus : menus,
                                                schemas : schemas,
                                                upcomingOrders : table.upcomingOrders,
                                                upcomingPurchases : table.upcomingPurchases,
                                                transactionType : "order"
                                            });
                                            console.log("Adding new order...");
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

//CREATE
app.post('/admin/order',function (req,res) {
    var orderDetail = req.body.detail;
    var newOrderObj = req.body.query;
    var orderType = req.body.type;
    console.log(orderDetail);
    //insert the var orderDetail into the Order.orderDetail property
    newOrderObj.detail = orderDetail;
    //set order status as awaiting confirmation
    newOrderObj.status = 0;
    OrderScheme.findOne({name:orderType}, (err, foundScheme) => {
        if(err){console.log(err);} else {
            newOrderObj.type = foundScheme;
            Order.create(newOrderObj, (err, newOrder) => {
                if(err){console.log(err);} else {
                    console.log("New order created for : " + newOrder.name);
                    res.redirect('/admin/order');
                }
            });
        }
    });
});

//SHOW
app.get('/admin/order/:id',function (req,res) {
    Order.findById(req.params.id, (err, order) =>{
        if(err){console.log(err);}else{
            Menu.find({}, (err, menus)=>{
                if(err){console.log(err);}else{
                    res.render('transactionPage/show', {data:order,menus:menus, transactionType:"order"});
                }
            });
        }
    });
});

//EDIT
app.get('/admin/order/:id/edit',function (req,res) {
    Order.findById(req.params.id, (err, order)=> {
        if(err){console.log(err);}else{
            Menu.find({}, (err, menus)=>{
                if(err){console.log(err);}else{
                    OrderScheme.find({}, (err, schemas) => {
                        if(err){console.log(err);} else {
                            res.render('transactionPage/edit', {
                                data:order,
                                menus:menus,
                                schemas:schemas,
                                transactionType:"order"
                            });
                            
                        }
                    });
                }
            });
        }
    });
});

//UPDATE
app.put('/admin/order/:id',function (req,res) {
    var orderDetail = req.body.detail;
    var newOrderObj = req.body.query;
    var orderType = req.body.type;
    console.log(newOrderObj);
    console.log(orderDetail);
    newOrderObj.detail = orderDetail;
    OrderScheme.findOne({name:orderType}, (err, foundScheme) => {
        newOrderObj.type = foundScheme;
        Order.findByIdAndUpdate(req.params.id, newOrderObj, {new: true}, (err,updatedOrder)=> {
            if(err){console.log(err);} else {                
                console.log("Updated entry for " + req.params.id);
                res.redirect('/admin/order/'+req.params.id);
            }
        });
    });
});

//SPECIAL - UPDATE orderStatus
app.put('/admin/order/:id/status',function (req,res) {
    Order.findById(req.params.id, (err, order)=> {
        if(err){console.log(err);} else {
            //Store Order object in newObject var
            var newOrder = order;
            //Increment the newOrder.orderStatus by 1
            newOrder.status = order.status + 1;
            //Check if newOrder.orderStatus is not 1 (if 1, update the stock)
            if(newOrder.status === 1){
                Menu.find({}, (err, menus)=>{
                    if(err){console.log(err);} else {
                        //Loop through menus
                        menus.forEach(function(menu){
                            //Substract the menu stock with the ordered quantity and store it into newStock
                            var newStock = menu.stock - Number(newOrder.detail[menu.name]);
                            //Console.log just to be safe
                            console.log(menu.stock + " - " + newOrder.detail[menu.name] + " = " + newStock);
                            //Store the menu in other variable to keep the old one safe
                            var newMenu = menu;
                            //set the new stock into the variable
                            newMenu.stock = newStock;
                            //Update the entry on DB
                            Menu.findOneAndUpdate({name: menu.name}, newMenu, {new:true}, (err, updatedMenu)=>{
                                if(err){console.log(err);} else {
                                    console.log("Updated Menu : " + updatedMenu.name + " - " + updatedMenu.stock);
                                }
                            });
                        });
                    }
                });
            }
            //Update the DB
            Order.findByIdAndUpdate(req.params.id, newOrder, {new:true}, (err, updatedStatus)=> {
                console.log("New status : " + updatedStatus.status);
                res.redirect('/admin/order/'+req.params.id);
            });

        }
    });
});

//DESTROY
app.delete('/admin/order/:id',function (req,res) {
    Order.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/admin/order');
    })
});

//========= PURCHASE ROUTE ============================
//INDEX
app.get('/admin/purchase',function (req,res) {
    Purchase.find({}, (err, purchases) => {
        if(err){console.log(err);} else{
            Menu.find({}, (err,menus) => {
                if(err){console.log(err);} else {
                    res.render('transactionPage/index', {
                        datas           : purchases,
                        menus           : menus,
                        transactionType : "purchase"
                    });
                }
            });
        }
    });
});

//NEW
app.get('/admin/purchase/new', function(req, res){

    Menu.find({}).exec()
        .then(menus => {
            Purchase.find({}).exec()
                .then(purchases => {
                    Order.find({}).exec()
                        .then(orders => {
                            OrderScheme.find({}).exec()
                                .then(schemas => {
                                    getStatusTable(menus, purchases, orders)
                                        .then(table => {
                                            res.render('transactionPage/new', {
                                                menus : menus,
                                                schemas : schemas,
                                                upcomingOrders : table.upcomingOrders,
                                                upcomingPurchases : table.upcomingPurchases,
                                                transactionType : "purchase"
                                            });
                                            console.log("Adding new order...");
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
        
});

//CREATE
app.post('/admin/purchase', function(req, res){
    var purchaseDetail = req.body.detail;
    var newPurchaseObj = req.body.query;
    var purchaseType = req.body.type;
    //insert the var orderDetail into the Order.orderDetail property
    newPurchaseObj.detail = purchaseDetail;
    //set purchaseStatus as 0
    newPurchaseObj.status = 0;
    //find the scheme inputed
    PurchaseScheme.findOne({name:purchaseType}, (err, foundScheme) => {
        if(err){console.log(err);} else {
            //insert scheme into the object
            newPurchaseObj.type = foundScheme;
            Purchase.create(newPurchaseObj, (err, newPurchase) => {
                if(err){console.log(err);} else {
                    console.log("Created new purchase for : " + newPurchase.name);
                    res.redirect('/admin/purchase');
                }
            });
        }
    });
});

//SHOW
app.get('/admin/purchase/:id', function(req, res){
    Purchase.findById(req.params.id, (err, purchase) => {
        if(err){console.log(err);} else {
            Menu.find({}, (err, menus) => {
                if(err){console.log(err);} else {
                    res.render('transactionPage/show', {
                        data:purchase,
                        menus:menus,
                        transactionType: "purchase"
                    });
                }
            });
        }
    });
});

//EDIT
app.get('/admin/purchase/:id/edit', function(req, res){
    Purchase.findById(req.params.id, (err, purchase) => {
        if(err){console.log(err);} else {
            Menu.find({}, (err, menus) => {
                if(err){console.log(err);} else {
                    PurchaseScheme.find({}, (err, schemas) => {
                        if(err){console.log(err);} else {
                            res.render('transactionPage/edit', {
                                data : purchase,
                                menus : menus,
                                schemas : schemas,
                                transactionType: "purchase"
                            });
                        }
                    });
                }
            });
        }
    });
});

//CHANGE STATUS
app.put('/admin/purchase/:id/status', function(req, res){
    Purchase.findById(req.params.id, (err, purchase) => {
        if(err){console.log(err);} else {
            var newPurchase = purchase;
            newPurchase.status = purchase.status + 1;
            if(newPurchase.status === 1){
                Menu.find({}, (err, menus) => {
                    if(err){console.log(err);} else {
                        menus.forEach(menu => {
                            var newStock = menu.stock + Number(newPurchase.detail[menu.name]);
                            console.log(menu.stock + " + " + newPurchase.detail[menu.name] + " = " + newStock);
                            var newMenu = menu;
                            newMenu.stock = newStock;
                            Menu.findOneAndUpdate({name: menu.name}, newMenu, {new:true}, (err, updatedMenu) => {
                                if(err){console.log(err);} else {
                                    console.log("Updated Menu :" + updatedMenu.name + " - " + updatedMenu.stock)
                                }
                            });
                        });
                    }
                });
            }
        Purchase.findByIdAndUpdate(req.params.id, newPurchase, {new:true}, (err, updatedStatus) => {
            console.log("New Status : " + updatedStatus.status);
            res.redirect('/admin/purchase/' + req.params.id);
        });
        }
    });
});

//UPDATE
app.put('/admin/purchase/:id', function(req, res){
    var purchaseDetail = req.body.detail;
    var newPurchaseObj = req.body.query;
    var purchaseType = req.body.type;
    newPurchaseObj.detail = purchaseDetail;
    console.log(newPurchaseObj);
    PurchaseScheme.findOne({name:purchaseType}, (err, foundScheme) => {
        newPurchaseObj.type = foundScheme;
        Purchase.findByIdAndUpdate(req.params.id, newPurchaseObj, {new: true}, (err,updatedOrder)=> {
            if(err){console.log(err);} else {
                console.log("Updated entry for " + req.params.id);
                res.redirect('/admin/purchase/'+req.params.id);
            }
        });
    });
});

//DESTROY
app.delete('/admin/purchase/:id', function(req, res){
    Purchase.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/admin/purchase');
    });
});


// //404 Handler
// app.get('/*',function (req,res) {
//    res.send("404, not found!")
// });

//Port Listener
var port = 3000;
app.listen(port, function(){
console.log('rjdPOS is listening on port ' + port);
});

//FUNCTION LAND (temp)

function createUpcomingOrderArray(orders, menus) {
    var upcomingOrders = [];
    // check how many arrays inside menus
    console.log("Total menus : " + menus.length);
    for(i=0;i<menus.length;i++){
        //push as many zeros as menus array to initiate the array
        upcomingOrders.push(0);
    }
    console.log(upcomingOrders);
    //Loop through orders array
    orders.forEach(order => {
        //check if order is still eligible to be counted (any orderStatus under 1)
        if(order.orderStatus < 1){
            //set index
            var idx = 0;
            //Loop through menus array
            menus.forEach(menu => {
                var orderDetail = Number(order.orderDetail[menu.name]);
                //on every itteration, add the orderDetail with the same key as menu.name to the upcomingOrder array
                upcomingOrders[idx] += orderDetail
                idx++;
            });
        }
        console.log(upcomingOrders);
        return upcomingOrders;
    });
}