const express = require('express');
const router = express.Router()

router.get('/',function (req,res) {
    res.render('login');
    console.log("login page");
});

module.exports = router;