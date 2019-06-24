var mongoose = require('mongoose');
var Menu = require('./models/menu');

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
        color: "#301934",
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
}

module.exports = seedDB;