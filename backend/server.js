const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const users = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send("working🚀");
});

app.post('/login', async (req, res) => {

  const userExisting = users.find(user => 
    user.username === req.body.username 
  );

  if (userExisting) {
    const passwordValid = await bcrypt.compare(req.body.password,userExisting.password)
    if ( passwordValid ) {
      res.status(201).send("Welcome back 🚀");      
    } 
    else if ( !passwordValid ) {
      res.status(400).send("invalid password");
    }
  } 
  else if (!userExisting) {
    res.status(404).send("User doesnt exist");
  }
});

app.post('/signup', async (req, res) => {
  const userExists = users.find(user =>
    user.username === req.body.username
  );

  if (userExists) {
    res.send("Username already exists ❌");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    users.push({
      username: req.body.username,
      password: hashedPassword
    });
    res.send("Signup successful ✅");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
