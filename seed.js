var mongoose = require('mongoose');
var Menu = require('./models/menu');

var menuData= [
    {
        name: "Pisang",
        emoji: "🍌",
        stock: 12
    },
    {
        name: "Strawberry",
        emoji: "🍓",
        stock: 10
    },
    {
        name: "Greentea",
        emoji: "🍵",
        stock: 4
    },
    {
        name: "Teh Tarik",
        emoji: "🥃",
        stock: 10
    },
    {
        name: "Mangga",
        emoji: "🍑",
        stock: 5
    },
    {
        name: "Coklat",
        emoji: "🍫",
        stock: 20
    },
    {
        name: "Bubblegum",
        emoji: "🍶",
        stock: 4
    },
    {
        name: "Cappucino",
        emoji: "☕",
        stock: 5
    },
    {
        name: "Taro",
        emoji: "🍠",
        stock: 8
    },
    {
        name: "Grape",
        emoji: "🍇",
        stock: 6
    },
    {
        name: "Kopi",
        emoji: "☕",
        stock: 6
    },
    {
        name: "Red Velvet",
        emoji: "🍰",
        stock: 5
    },
    {
        name: "Leci",
        emoji: "🍒",
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