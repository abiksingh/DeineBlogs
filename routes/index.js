const express = require('express');
const router = express.Router();
const {ensureAuth,ensureGuest} = require('../middleware/auth');

const Blog = require('../models/Blog');



router.get('/', ensureGuest, (req,res)=>{
    res.render('loginContent',{
        layout: 'login'
    })
});




router.get('/dashboard', ensureAuth, async (req, res)=>{
   
   try {
       const blogs = await Blog.find({user: req.user.id}).lean();
       res.render('dashboard',{
        name: req.user.displayName,
        blogs
    })
   } catch (err) {
       console.error(err);
       res.render('error/500')
   }
   
   
});




module.exports = router;