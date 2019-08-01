var Menu        = require("../models/menu"),
    Order       = require("../models/order"),
    Purchase    = require("../models/purchase")


var menuQuery       = Menu.find({}).exec();
var purchaseQuery   = Purchase.find({}).exec();
var orderQuery      = Order.find({}).exec();

const getStatusTable = function(menus, purchases, orders) {
    //Initialize both arrays
    var upcomingOrders = [];
    var upcomingPurchases = [];
    //Count how many menus
    console.log("Total menus : " + menus.length);
    for(i=0;i<menus.length;i++){
        upcomingOrders.push(0);
        upcomingPurchases.push(0);
    };
    //Verify array is initialize
    console.log({
        upcomingOrders,
        upcomingPurchases
    });
    //Populate purchases array
    purchases.forEach(purchase => {
        //Check purchases status
        if(purchase.status < 1) {
            //set index
            var idx = 0;
            //Loop through menus
            menus.forEach(menu => {
                var purchaseDetail = Number(purchase.detail[menu.name]);
                upcomingPurchases[idx] += purchaseDetail;
                idx++
            });
        }
        
    });
    //Populate orders array
    orders.forEach(order => {
        if(order.status < 1) {
            var idx = 0;
            menus.forEach(menu => {
                var orderDetail = Number(order.detail[menu.name]);
                upcomingOrders[idx] += orderDetail;
                idx++
            });
        }
    });

    console.log({
        upcomingOrders,
        upcomingPurchases
    });

    //Pack it inside an object and promise
    var a = {upcomingOrders, upcomingPurchases}
    return Promise.resolve(a);
}

// function getStatusTable() {  

//     Menu.find({}, (err, menus) => {
//         if(err){console.log(err);} else {
//             Purchase.find({}, (err, purchases) => {
//                 if(err){console.log(err);} else {
//                     Order.find({}, (err,orders) => {
//                         //ADD UPCOMINGORDERS
//                         var upcomingOrders = [];
//                         var upcomingPurchases = [];
//                         // check how many arrays inside menus
//                         console.log("Total menus : " + menus.length);
//                         for(i=0;i<menus.length;i++){
//                             //push as many zeros as menus array to initiate the array
//                             upcomingPurchases.push(0);
//                             upcomingOrders.push(0);
//                         }
//                         console.log("upcomingPurchases");
//                         console.log(upcomingPurchases);
//                         console.log("upcomingOrders");
//                         console.log(upcomingOrders);
//                         //Loop through orders array
//                         purchases.forEach(purchase => {
//                             //check if order is still eligible to be counted (any orderStatus under 1)
//                             if(purchase.status < 1){
//                                 //set index
//                                 var idx = 0;
//                                 //Loop through menus array
//                                 menus.forEach(menu => {
//                                     var purchaseDetail = Number(purchase.detail[menu.name]);
//                                     //on every itteration, add the orderDetail with the same key as menu.name to the upcomingOrder array
//                                     upcomingPurchases[idx] += purchaseDetail
//                                     idx++;
//                                 });
//                             }
//                             console.log(upcomingPurchases);
//                         });

//                         orders.forEach(order => {
//                             //check if order is still eligible to be counted (any orderStatus under 1)
//                             if(order.status < 1){
//                                 //set index
//                                 var idx = 0;
//                                 //Loop through menus array
//                                 menus.forEach(menu => {
//                                     var orderDetail = Number(order.detail[menu.name]);
//                                     //on every itteration, add the orderDetail with the same key as menu.name to the upcomingOrder array
//                                     upcomingOrders[idx] += orderDetail
//                                     idx++;
//                                 });
//                             }
//                             console.log(upcomingOrders);
//                             var a = {};
//                             a.upcomingOrders = upcomingOrders;
//                             a.upcomingPurchases = upcomingPurchases;
//                             a.menus = menus;
//                             return a
//                         });
//                     });
//                 }
//             });
//         }
//     });
// }

module.exports = getStatusTable;