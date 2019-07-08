var mongoose = require('mongoose');
var Menu = require('./models/menu');
var OrderSchema = require('./models/orderschema');
var PurchaseSchema = require('./models/purchaseschema');

var menuData= [
    {
        name: "Pisang",
        emoji: "🍌",
        color: "#f7e92c",
        stock: 12
    },
    {
        name: "Strawberry",
        emoji: "🍓",
        color: "#d53032",
        stock: 10
    },
    {
        name: "Greentea",
        emoji: "🍵",
        color: "#d0f0c0",
        stock: 4
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
        stock: 5
    },
    {
        name: "Coklat",
        emoji: "🍫",
        color: "#d2691e",
        stock: 20
    },
    {
        name: "Bubblegum",
        emoji: "🍶",
        color: "#87ceeb",
        stock: 4
    },
    {
        name: "Cappucino",
        emoji: "☕",
        color: "#b5651d",
        stock: 5
    },
    {
        name: "Taro",
        emoji: "🍠",
        color: "#b19cd9",
        stock: 8
    },
    {
        name: "Grape",
        emoji: "🍇",
        color: "#cc8899",
        stock: 6
    },
    {
        name: "Kopi",
        emoji: "☕",
        color: "#6f4e37",
        stock: 6
    },
    {
        name: "Red Velvet",
        emoji: "🍰",
        color: "#e9967a",
        stock: 5
    },
    {
        name: "Leci",
        emoji: "🍒",
        color: "#f2f2f2",
        stock: 5
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
    PurchaseSchema.deleteMany({}, (err) => {
        if(err){console.log(err);}else{
            console.log("Purchase Schema is cleared");
            purchaseScheme.forEach(function(seed){
                PurchaseSchema.create(seed, (err, schema)=>{
                    if(err){console.log(err);}else{
                        console.log("Added Schema : " + schema.name);
                    }
                });
            });
        }
    });
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