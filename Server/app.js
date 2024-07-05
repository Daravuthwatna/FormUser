const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {db} = require('./db/db')

const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const server =()=> {
  db();
  app.listen(PORT, ()=>{
    console.log('Running On Port', PORT)
  });
  app.get('/', (req, res)=>{
    res.send({
      success: true,
      message: 'Express is running...'
    })
  });
  const User = mongoose.model('User',{
    id: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    age: {
      type: Number,
      require: true
    },
    email: {
      type: String,
      require: true
    }
  });
  app.post('/adduser', async(req, res)=>{
    try {
      const users = await User.find({});
      let id;
      if(users.length>0){
        let lastUserArray = users.slice(-1);
        let lastUser = lastUserArray[0];
        id = lastUser.id+1;
      } else {
        id = 1;
      }
      const user = new User({
        id: id,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
      });
      await user.save();
      console.log(`User Save => ${user}`);
      res.send({
        message: 'Add successfuly...',
        user,
      });
    } catch (error) {
      res.send({
        success: false,
        message: 'Add Error...'
      })
    }
  });
  app.get('/get/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await User.findOne({ id: id });
      if (user) {
        res.send(user);
      } else {
        res.send({
          success: false,
          message: 'User not found...',
        });
      }
    } catch (error) {
      res.send({
        success: false,
        message: 'ID Error...',
      });
    }
  });
  app.put('/update/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await User.findOneAndUpdate(
        { id: id },
        {
          name: req.body.name,
          age: req.body.age,
          email: req.body.email,
        },
        { new: true }
      );
      if (user) {
        res.send({        
          message: 'update successfuly...',
          user,
        });
      } else {
        res.send({
          success: false,
          message: 'User not found...',
        });
      }
    } catch (error) {
      res.send({
        success: false,
        message: 'ID Error...',
      });
    }
  });
  app.post('/removeuser', async(req, res)=>{
    try {
      const user = await User.findOneAndDelete({
        id: req.body.id
      })
      res.send({
        message: 'Delete successfuly...',
        user,
      });
    } catch (error) {
      res.send({
        success: false,
        message: 'Delete Error...'
      })
    }
  });
  app.get('/alluser', async(req, res)=>{
    try {
      const user = await User.find({});
      res.send(user);
    } catch (error) {
      res.send({
        success: false,
        message: 'User Error...'
      })
    }
  });
  const Admin = mongoose.model('Admin', {
    Userid: {
      type: Number,
      require: true
    },
    Username: {
      type: String,
      require: true
    },
    Useremail: {
      type: String,
      require: true
    },
    Userpassword: {
      type: String,
      require: true
    }
  });
  app.post('/signup', async (req, res) => {
    try {
      const { Useremail, Userid, Username, Userpassword } = req.body;
      let check = await Admin.findOne({ Useremail });
      if (check) {
        return res.status(400).send({
          success: false,
          message: 'Email already exists'
        });
      }
      const admin = new Admin({
        Userid,
        Username,
        Useremail,
        Userpassword
      });
      await admin.save();
      const data = {
        admin: {
          Userid: admin.Userid
        }
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } catch (error) {
      console.error('Sign Up Error:', error);
      res.status(500).send("Internal Server Error");
    }
  });
  app.post('/login', async (req, res) => {
    try {
      const { Useremail, Userpassword } = req.body;
      let admin = await Admin.findOne({ Useremail });
      if (!admin) {
        return res.status(400).json({ success: false, error: "Wrong Email" });
      }
      const passCompare = Userpassword === admin.Userpassword;
      if (!passCompare) {
        return res.status(400).json({ success: false, error: "Wrong password" });
      }
      const data = {
        user: {
          id: admin.id
        }
      };
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get('/admin', async(req, res)=>{
    try {
      const admin = await Admin.find({});
      res.send(admin)
    } catch (error) {
      res.send({
        success: false,
        message: 'Admin Error...'
      })
    }
  });
};
server();