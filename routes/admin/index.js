const express = require('express'),
      router = express.Router(),
      Menu = require('../../models/menu'),
      Purchase = require('../../models/purchase'),
      Order = require('../../models/order'),
      OrderScheme = require('../../models/orderschema'),
      getStatusTable = require('../../helper/functions')

router.get('/',function (req,res) {
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
                                            res.render('admin/index', {
                                                menus : menus,
                                                schemas : schemas,
                                                upcomingOrders : table.upcomingOrders,
                                                upcomingPurchases : table.upcomingPurchases,
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

module.exports = router