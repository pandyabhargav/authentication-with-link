const Blog = require('../config/blogscema');


exports.renderAddBlog = (req, res) => {
  res.render('add', { user: req.user });
};


exports.renderEditBlog = (req, res) => {

  Blog.findOne({ _id: req.params.id, user: req.user.id })
    .then(blog => {
      if (!blog) {
        return res.redirect('/myblog');
      }
      res.render('edit', { blog, user: req.user });
    })
    .catch(err => console.log(err)); 
};


exports.renderAllBlogs = (req, res) => {
  Blog.find()
    .populate('user') // Populate user data if needed
    .populate('comments') // Populate comments to include user information
    .then(blogs => {
      res.render('allblog', { blogs, user: req.user });
    })
    .catch(err => {
      console.error('Error fetching all blogs:', err);
      res.status(500).send('Internal Server Error');
    });
};




exports.renderMyBlogs = (req, res) => {
  console.log('User:', req.user);
  if (!req.user) {
      return res.redirect('/login'); 
  }

  Blog.find({ user: req.user.id })
      .then(blogs => {
          res.render('myblog', { blogs,user: req.user  }); 
      })
      .catch(err => console.log(err)); 
};


exports.addBlog = (req, res) => {
  const { title, content } = req.body; 
  const image = req.file ? `/uploads/${req.file.filename}` : null; 

  console.log("user",req.user.name);
  

  const newBlog = new Blog({
    title,
    content,
    image,
    user: req.user.id,
    author: req.user.name 
});


  newBlog.save()
    .then(() => res.redirect('/myblog'))
    .catch(err => console.log(err)); 
};


exports.editBlog = (req, res) => {
  console.log("edit");
  const { title, content } = req.body; 
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const updateData = { title, content }; 
  if (image) {
    updateData.image = image; 
  }


  Blog.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updateData, 
    { new: true }
  )
  .then(() => res.redirect('/myblog')) 
  .catch(err => {
    console.error('Error updating blog:', err); 
    res.status(500).send('Internal Server Error');
  });
};

// Delete a blog
exports.deleteBlog = (req, res) => {
  console.log("Attempting to delete blog with ID:", req.params.id);
  
 
  Blog.findOneAndDelete({ _id: req.params.id, user: req.user.id })
      .then(blog => {
          if (!blog) {
              console.log("Blog not found or doesn't belong to the user.");
              return res.status(404).send('Blog not found or you do not have permission to delete this blog.'); 
          }
          console.log("Blog deleted successfully.");
          res.redirect('/myblog'); 
      })
      .catch(err => {
          console.error('Error deleting blog:', err); 
          res.status(500).send('Internal Server Error');
      });
};

