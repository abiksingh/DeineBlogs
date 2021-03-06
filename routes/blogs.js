const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

const Blog = require('../models/Blog');



router.get('/add', ensureAuth, (req,res)=>{
    res.render('blogs/add')
});




router.post('/', ensureAuth, async (req,res)=>{
    try {
        req.body.user = req.user.id
        await Blog.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});





router.get('/', ensureAuth, async (req,res)=>{
    try {
    const blogs = await Blog.find({status: 'public'}).populate('user').sort({createdAt:'desc'}).lean()

    res.render('blogs/index', {
        blogs
    })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
});


router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const blog = await Blog.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!blog) {
        return res.render('error/404')
      }
  
      if (blog.user != req.user.id) {
        res.redirect('/blogs')
      } else {
        res.render('blogs/edit', {
          blog,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  });




router.put('/:id', ensureAuth, async (req,res)=>{
    let blog = await Blog.findById(req.params.id).lean()

    if(!blog){
        return res.render('error/404')
    }

    if (blog.user != req.user.id) {
        res.redirect('/blogs')
      } else {
        blog = await Blog.findOneAndUpdate({_id: req.params.id}, req.body,{
            new: true,
            runValidators: true
        })

        res.redirect('/dashboard')
        
      }
});



router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let blog = await Blog.findById(req.params.id).lean()
  
      if (!blog) {
        return res.render('error/404')
      }
  
      if (blog.user != req.user.id) {
        res.redirect('/blogs')
      } else {
        await Blog.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  });



router.get('/:id', ensureAuth, async (req, res) => {
    try {
      let blog = await Blog.findById(req.params.id).populate('user').lean()
  
      if (!blog) {
        return res.render('error/404')
      }
  
      res.render('blogs/show', {
        blog,
      })
    } catch (err) {
      console.error(err)
      res.render('error/404')
    }
  });



router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const blogs = await Blog.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('blogs/index', {
        blogs,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  });
  
  module.exports = router
  





module.exports = router;