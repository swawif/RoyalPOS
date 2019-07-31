const express = require('express'),
      router = express.Router(),
      Menu  = require('../../../models/menu');

// INDEX - Menu List Page
router.get('/',function (req,res) {
    Menu.find({},function(err, menus){
        if(err){
            console.log(err);
        } else {
            res.render('admin/menu', {menus:menus});
        }
    });
});

// NEW - Submit New Menu
router.get('/new',function (req,res) {
    res.render('admin/newMenu');
});

// POST - Process new menu into DB
router.post('/',function (req,res) {
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
                res.redirect('/admin/settings/menu')
                console.log("Menu Existed! : " + foundMenu.name + ", Canceling...");
            // If not, add the new menu to the DB
            } else if (foundMenu === null) {
                Menu.create(req.body.menu, function(err,newMenu){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("New Menu : " + req.body.menu.name);
                        res.redirect('/admin/settings/menu');
                    }
               });
            }
        }
    });
});

// Show/Edit
router.get('/:id/edit',function (req,res) {
    Menu.findById(req.params.id, function(err,menu) {
        if(err){console.log(err); res.redirect('/admin/settings/menu');} else {
            console.log("Editing menu : " + menu.name);
            res.render('admin/editMenu', {menu:menu});
        }
    });
});

// Update -- TODO MAKE DUPLICATE PROTECTION
router.put('/:id',function (req,res) {
    Menu.findByIdAndUpdate(req.params.id, req.body.menu, {new: true}, (err,newMenu) => {
        if(err){
            console.log(err);
        } else {
            console.log("Updated Menu!");
            console.log(newMenu);
            res.redirect('/admin/settings/menu');
        }
    });
});

// Destroy
router.delete('/:id',function (req,res) {
    Menu.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log(err);
        } else {
            console.log("Deleted menu : " + req.params.id);
            res.redirect('/admin/settings/menu');
        }
    })
});

module.exports = router