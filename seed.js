var mongoose = require('mongoose');
var Menu = require('./models/menu');
var OrderSchema = require('./models/orderschema');
var PurchaseSchema = require('./models/purchaseschema');
var Order = require('./models/order');
var Purchase = require('./models/purchase');

var menuData= [
    {
        name: "Pisang",
        emoji: "🍌",
        color: "#f7e92c",
        stock: 15
    },
    {
        name: "Strawberry",
        emoji: "🍓",
        color: "#d53032",
        stock: 20
    },
    {
        name: "Greentea",
        emoji: "🍵",
        color: "#d0f0c0",
        stock: 30
    },
    {
        name: "Teh Tarik",
        emoji: "🥃",
        color: "#ffe4c4",
        stock: 10
    },
    {
        name: "Mangga",
        emoji: "🍑",
        color: "#ff8243",
        stock: 20
    },
    {
        name: "Coklat",
        emoji: "🍫",
        color: "#d2691e",
        stock: 35
    },
    {
        name: "Bubblegum",
        emoji: "🍶",
        color: "#87ceeb",
        stock: 25
    },
    {
        name: "Cappucino",
        emoji: "☕",
        color: "#b5651d",
        stock: 20
    },
    {
        name: "Taro",
        emoji: "🍠",
        color: "#b19cd9",
        stock: 15
    },
    {
        name: "Grape",
        emoji: "🍇",
        color: "#cc8899",
        stock: 15
    },
    {
        name: "Kopi",
        emoji: "☕",
        color: "#6f4e37",
        stock: 15
    },
    {
        name: "Red Velvet",
        emoji: "🍰",
        color: "#e9967a",
        stock: 20
    },
    {
        name: "Leci",
        emoji: "🍒",
        color: "#f2f2f2",
        stock: 20
    }
];

var orderScheme = [
    {
        name: "Ecer",
        price: 10000
    },
    {
        name: "10Gros",
        price: 9000
    },
    {
        name: "20Gros",
        price: 8000
    },
    {
        name: "50Gros",
        price: 7500
    },
    {
        name: "100Gros",
        price: 7000
    },
    {
        name: "200Gros",
        price: 6500
    },
]

var purchaseScheme = [
    {
        name: "1beli", //100-200
        price: 6500
    },
    {
        name: "2beli", //200-300
        price: 6000
    },
    {
        name: "3beli", //300>
        price: 5500
    }
]

var orderData = [
    {
        name    : "arif",
        type    : "20gros",
        phoneNum: 81212493669,
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :1,
            strawberry  :5,
            greentea    :10,
            mangga      :0,
            'teh tarik' :0,
            coklat      :0,
            bubblegum   :0,
            cappucino   :0,
            taro        :0,
            grape       :3,
            kopi        :5,
            'red velvet':1,
            leci        :3
        }
    },
    {
        name    : "Bambang",
        type    : "10gros",
        phoneNum: 81212493669,
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :0,
            strawberry  :1,
            greentea    :1,
            mangga      :1,
            'teh tarik' :0,
            coklat      :1,
            bubblegum   :0,
            cappucino   :1,
            taro        :1,
            grape       :1,
            kopi        :3,
            'red velvet':1,
            leci        :0
        }
    },
    {
        name    : "Budiman",
        type    : "100gros",
        phoneNum: 81212493669,
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :10,
            strawberry  :10,
            greentea    :10,
            mangga      :20,
            'teh tarik' :10,
            coklat      :10,
            bubblegum   :5,
            cappucino   :10,
            taro        :15,
            grape       :10,
            kopi        :10,
            'red velvet':5,
            leci        :5
        }
    }
];

var purchaseData = [
    {
        name    : "RJD Home",
        type    : "3beli",
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :20,
            strawberry  :30,
            greentea    :30,
            mangga      :20,
            'teh tarik' :10,
            coklat      :30,
            bubblegum   :25,
            cappucino   :20,
            taro        :20,
            grape       :30,
            kopi        :15,
            'red velvet':15,
            leci        :35
        }
    },
    {
        name    : "Agen 1",
        type    : "2beli",
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :10,
            strawberry  :10,
            greentea    :10,
            mangga      :10,
            'teh tarik' :10,
            coklat      :10,
            bubblegum   :10,
            cappucino   :15,
            taro        :15,
            grape       :15,
            kopi        :35,
            'red velvet':15,
            leci        :10
        }
    },
    {
        name    : "Agen 2",
        type    : "1beli",
        date    : Date('2019-06-19T00:00:00.000+00:00'),
        status  : 0,
        detail  : {
            pisang      :10,
            strawberry  :10,
            greentea    :10,
            mangga      :20,
            'teh tarik' :10,
            coklat      :10,
            bubblegum   :10,
            cappucino   :10,
            taro        :10,
            grape       :10,
            kopi        :10,
            'red velvet':10,
            leci        :10
        }
    }
];

// var orderData = [
//     {
//         custName: "Arif",
//         orderType: "20Gros",
//         phoneNum: 081212493669,
//         isBuying: false,
//         orderDate: 2019-06-19T00:00:00.000Z,
//         orderCode: "NDYTS",
//         orderStatus: "Menunggu Konfirmasi",
//         orderDetail: {
//             pisang: '1',
//             cappucino: '21',
//             taro: '8',
//             grape: '2',
//             kopi: '8'
//         }
//     }
// ]

function seedDB(){
    //REMOVE EVERYTHING
    Menu.deleteMany({},function(err){
        if(err){console.log(err);} else {
            console.log("Menu is cleared");
            // Add the menus back
            menuData.forEach(function(seed){
                Menu.create(seed, function(err, menu){
                    if(err){console.log(err);} else {
                        console.log('Added menu : ' + menu.name);
                    }
                });
            });
        }
    });
    Order.deleteMany({}, (err) => {
        if(err){console.log(err);} else{
            console.log("Order db is cleared");
            orderData.forEach(seed => {
                Order.create(seed, (err, newOrder) => {
                    if(err){console.log(err);} else{
                        console.log("Created new order for " + newOrder.name);
                    }
                });
            });
        }
    });
    Purchase.deleteMany({}, (err) => {
        if(err){console.log(err);} else{
            console.log("Purchase DB is cleared");
            purchaseData.forEach(seed => {
                Purchase.create(seed, (err, newPurchase) => {
                    console.log("Created new purchase for " + newPurchase.name);
                });
            });
        }
    });
    // PurchaseSchema.deleteMany({}, (err) => {
    //     if(err){console.log(err);}else{
    //         console.log("Purchase Schema is cleared");
    //         purchaseScheme.forEach(function(seed){
    //             PurchaseSchema.create(seed, (err, schema)=>{
    //                 if(err){console.log(err);}else{
    //                     console.log("Added Schema : " + schema.name);
    //                 }
    //             });
    //         });
    //     }
    // });
    // OrderSchema.deleteMany({}, (err) => {
    //     if(err){console.log(err);}else{
    //         console.log("Order Schema is cleared");
    //         orderScheme.forEach(function(seed){
    //             OrderSchema.create(seed, (err, schema)=>{
    //                 if(err){console.log(err);}else{
    //                     console.log("Added Schema : " + schema.name);
    //                 }
    //             });
    //         });
    //     }
    // });
}

module.exports = seedDB;