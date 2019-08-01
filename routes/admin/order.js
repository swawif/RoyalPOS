const express   = require('express'),
    router      = express.Router(),
    Menu        = require('../../models/menu')
    Order       = require('../../models/order')
    Purchase    = require('../../models/purchase')
    OrderScheme = require('../../models/orderschema'),
    getStatusTable = require('../../helper/functions')

//INDEX - Show all orders
router.get('/',function (req,res) {
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
router.get('/new',function (req,res) {
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
router.post('/',function (req,res) {
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
router.get('/:id',function (req,res) {
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
router.get('/:id/edit',function (req,res) {
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
router.put('/:id',function (req,res) {
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
router.put('/:id/status',function (req,res) {
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
router.delete('/:id',function (req,res) {
    Order.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/admin/order');
    })
});

module.exports = router;