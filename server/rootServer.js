const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
//need to use body parser in order for express to understand the json string its passing -import bodyParser
app.use(bodyParser.json());
app.use(cors());
let counter = 1;
function counts(counter) {
    return counter = counter + 1;
}

const db = {
    users:[
      {
        id:'0',
        name: 'pancho',
        email: 'pancho@gmail.com',
        password: 'rancho',
        joined: new Date(),
        entries: 0
      }
    ]
}

app.get('/',(req, res) => {
    res.send(db.users);
})

app.post('/signin',(req, res) =>{
  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password){
    res.json('OK mr. Pancho')
  }else {
    res.status(400).json('error loggin in')
  }
})

app.post('/register', (req, res) =>{
  const { email, name, password, entries } = req.body;
  bcrypt.hash(password, null, null, function(err, hash){
    console.log(hash)
  });
  db.users.push({
        id: counts(counter),
        name: name,
        email: email,
        password: password,
        joined: new Date(),
        entries: entries

  })
  res.json(db.users[db.users.length-1]);
})

app.get('/profile/:id', (req, res) =>{
  const { id } = req.params;
  let found = false;
  db.users.forEach(user =>{
    if(user.id === id){
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
      res.status(404).json('no such user');
    }
})

app.post('/counter', (req, res) =>{
  const {id} = req.body;
  let found = false;
  db.users.forEach(user => {
    if(user.id === id){
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if(!found){
    res.status(400).json("not found");
  }
})

app.listen(1337, ()=>{
  console.log("Server on 1337");
})

/*
 signin => POST = success/fail
 register => POST  = user
 profile/:userID => GET = user
 image => PUT => user-update count
*/
