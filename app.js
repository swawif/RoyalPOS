//Bismillahirahmanirahim
//TODOS
// MENU - Update -- TODO MAKE DUPLICATE PROTECTION


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
    Menu            = require('./models/menu'),         // Menu DB
    Order           = require('./models/order'),        // Incoming sales order DB
    OrderScheme     = require('./models/orderschema');  // Order Type DB
    Purchase        = require('./models/purchase'),     // Upcoming Purchases DB
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
            // If not, add the new menu to the DB
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
            Order.find({},(err,orders)=> {
                if(err){console.log(err);} else{
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
                    });

                    OrderScheme.find({},(err, schemas) => {
                        if(err){console.log(err);} else {
                            res.render('admin/newOrder', {menus : menus, schemas:schemas,upcomingOrders:upcomingOrders});
                            console.log("Adding new order...");
                        }
                    });
                }
            });

        }
    });
});

//CREATE
app.post('/admin/order',function (req,res) {
    var orderDetail = req.body.orderDetail;
    var newOrderObj = req.body.order;
    //insert the var orderDetail into the Order.orderDetail property
    newOrderObj.orderDetail = orderDetail;
    //set order status as awaiting confirmation
    newOrderObj.orderStatus = 0;
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
app.get('/admin/order/:id/edit',function (req,res) {
    Order.findById(req.params.id, (err, order)=> {
        if(err){console.log(err);}else{
            Menu.find({}, (err, menus)=>{
                if(err){console.log(err);}else{
                    res.render('admin/orderEdit', {order:order,menus:menus});
                }
            });
        }
    });
});

//UPDATE
app.put('/admin/order/:id',function (req,res) {
    var orderDetail = req.body.orderDetail;
    var newOrderObj = req.body.order;
    console.log(newOrderObj);
    console.log(orderDetail);
    newOrderObj.orderDetail = orderDetail;
    Order.findByIdAndUpdate(req.params.id, newOrderObj, {new: true}, (err,updatedOrder)=> {
        console.log("Updated entry for " + req.params.id);
        console.log(updatedOrder);
        res.redirect('/admin/order/'+req.params.id);
    });
});

//SPECIAL - UPDATE orderStatus
app.put('/admin/order/:id/status',function (req,res) {
    Order.findById(req.params.id, (err, order)=> {
        if(err){console.log(err);} else {
            //Store Order object in newObject var
            var newOrder = order;
            //Increment the newOrder.orderStatus by 1
            newOrder.orderStatus = order.orderStatus + 1;
            //Check if newOrder.orderStatus is not 1 (if 1, update the stock)
            if(newOrder.orderStatus === 1){
                Menu.find({}, (err, menus)=>{
                    if(err){console.log(err);} else {
                        //Loop through menus
                        menus.forEach(function(menu){
                            //Substract the menu stock with the ordered quantity and store it into newStock
                            var newStock = menu.stock - newOrder.orderDetail[menu.name];
                            //Console.log just to be safe
                            console.log(menu.stock + " - " + newOrder.orderDetail[menu.name] + " = " + newStock);
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
                console.log("New status : " + updatedStatus.orderStatus);
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