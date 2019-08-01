const express   = require("express"),
    router      = express.Router(),
    Purchase    = require('../../models/purchase'),
    Menu        = require('../../models/menu'),
    Order       = require('../../models/order'),
    PurchaseScheme= require('../../models/purchaseschema'),
    getStatusTable = require('../../helper/functions')

//INDEX
router.get('/',function (req,res) {
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
router.get('/new', function(req, res){

    Menu.find({}).exec()
        .then(menus => {
            Purchase.find({}).exec()
                .then(purchases => {
                    Order.find({}).exec()
                        .then(orders => {
                            PurchaseScheme.find({}).exec()
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
router.post('/', function(req, res){
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
router.get('/:id', function(req, res){
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
router.get('/:id/edit', function(req, res){
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
router.put('/:id/status', function(req, res){
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
router.put('/:id', function(req, res){
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
router.delete('/:id', function(req, res){
    Purchase.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/admin/purchase');
    });
});

module.exports = router