console.log('Server-side code running');

const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());

// connect to the db and start the express server
let db;

const url = 'mongodb://127.0.0.1:27017/clickDB';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080!!!');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.put('/score', (req, res) => {
  console.log(req.body);
  console.log('Data received: ' + JSON.stringify(req.body));
  db.collection('score').update({}, req.body, {upsert: true}, (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(200); // respond to the client indicating everything was ok
});

app.get('/score', (req, res) => {
  db.collection('score').findOne({}, (err, result) => {
    if (err) return console.log(err); // log if error occurs
    if(!result) return res.send({score: 0, playerName: '?'});
    res.send(result);
  });
});
