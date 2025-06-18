const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ Error connecting to MongoDB:", err.message);
});

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send("working🚀");
});

app.get('/profile', (req, res) => {
  console.log("Received request");

  const authHeader = req.headers['authorization']; 

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    res.json({ message: "Token is valid", user: decoded });
  });
});



app.post('/login', async (req, res) => {

  const userExisting = await User.findOne({username:req.body.username});

  if (userExisting) {
    const passwordValid = await bcrypt.compare(req.body.password,userExisting.password)
    if ( passwordValid ) {
      const token = jwt.sign({'username':req.body.username},process.env.JWT_SECRET_KEY,{ expiresIn:'30d'});
      res.status(201).json({
        'message':"welcome back",
        'token':token
      });      
    } 
    else if ( !passwordValid ) {
      res.status(400).json({'message':"invalid password"});
    }
  } 
  else if (!userExisting) {
    res.status(404).json({'message':"User doesnt exist"});
  }
});

app.post('/signup', async (req, res) => {
  const userExists = await User.findOne({username:req.body.username});

  if (userExists) {
    res.send("Username already exists ❌");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    NewUser = new User({
      username: req.body.username,
      password: hashedPassword
    });
    await NewUser.save();
    res.send("Signup successful ✅");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
