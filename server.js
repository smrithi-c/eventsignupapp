//Add different dependencies and modules
const dotenv = require('dotenv')
dotenv.config()
const express    = require('express');
const path       = require('path');
const app        = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const csvtojson  = require('csvtojson');
const firebase   = require('firebase');
const replace    = require('replace');
const nodemailer = require('nodemailer');
const jwt        = require('jsonwebtoken');
var secret = "G43xDkbyqGymYbkyCrtt3Y3qEQmaMb4fJ2VeYjJEBkMKXYSK3b"

//Initialize Firebase
var firebaseConfig = {
  apiKey: process.env.API,
  authDomain: "signup-form-e4c78.firebaseapp.com",
  databaseURL: "https://signup-form-e4c78.firebaseio.com",
  projectId: "signup-form-e4c78",
  storageBucket: "signup-form-e4c78.appspot.com",
  messagingSenderId: "1000336889334",
  appId: "1:1000336889334:web:f5099e3a8ecc1584"
};
firebase.initializeApp(firebaseConfig);

//Write data to Firebase
function writeFirebase(jsonData, collection) {
  var database = firebase.database();
  var ref = firebase.database().ref(collection);

  jsonData.forEach(item => {
    item.FULLNAME = item.FIRST + ' ' + item.LAST;
    ref.child(item.ID).set(item);
  });
}

//Read data from Firebase
function readFirebaseTickets() {
  return firebase.database().ref('tickets').once('value').then(function (snapshot) {
    var jsonData = [];
    snapshot.forEach(function (child) {

      var info = {
        "first": child.child("first").val(),
        "middle": child.child("middle").val(),
        "last": child.child("last").val(),
        "sID": child.child("sID").val(),
        "ticket": child.key,
        "grade": child.child("grade").val(),
        "guestBool": child.child("guestBool").val(),
        "guest": child.child("guest").val()
      }
      jsonData.push(info);

    });
    return jsonData;
  });
}

function verifyJWT(req) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


//Render main page
app.get('/', function (req, res) {
  res.render('login');
})

//Render login page
app.get('/login', function (req, res) {
  res.render('login');
})

app.post('/login', function(req, res ) {
  let username = req.body.username; 
  let password = req.body.password;

  const userRef = firebase.database().ref('users');
  userRef.orderByChild("username").equalTo(username).once('value').then( function(result) {
    console.log(result);
    try {
      if (!(result.exists())) {
        console.log("User Not Found");
        res.status(401).send({ error: "Invalid Username or Password" });
        res.end()
      }
      result.forEach(function (child) {
        var uname = child.child('username').val();
        var pwd = child.child('password').val();
        if (pwd == password){
          console.log("Login Successful");
          var token = jwt.sign({ id: username }, secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token });
        } else {
          console.log("Login Failed");
          res.status(401).send({ error: "Invalid Username or Password" });
        }
     });
    } catch (error) {
      console.log(error)
    }
  })
  


})

//Render main page
app.get('/index', function (req, res) {
  res.render('index');
})

//Render the search student page
app.get('/search-student', function (req, res) {
  res.render('search-student', {
    fbConfig: firebaseConfig
  });
})


//Render the ticket entry page
app.get('/ticket-entry', function (req, res) {
  res.render('ticket-entry');
})

//Render the upload files page
app.get('/upload', function (req, res) {
  res.render('upload');
})

//Render uploads page with status messages
app.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.render('msg', {
      msg: 'Please choose a file to upload',
      styleClass: 'alert-danger',
      status: 'error'
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let csvFile = req.files.csvFile;
  let collectionName = req.body.collectionName;
  let str = csvFile.data.toString('utf8');
  console.log(str)

  csvtojson().fromString(str).then(jsonData => {
    //console.log(jsonData);
    writeFirebase(jsonData, collectionName);
  });

  res.render('msg', {
    msg: 'Your file has been uploaded.',
    styleClass: 'alert-success',
    status: 'success'
  });
})

//Render the display tickets page
app.get('/display-ticket-data', function (req, res) {
  readFirebaseTickets().then(function (data) {
    console.log(data)
    res.render('display-ticket-data',
      {
        studentsData: data
      }
    );
  })
})

//Render the settings page
app.get('/settings', function (req, res) {
  res.render('settings');
})

//Render the help page
app.get('/help', function (req, res) {
  res.render('help');
})

//Listen for web application on Localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});