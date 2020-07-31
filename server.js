const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedData = require('./server/utils/seed-data');

const api = require('./server/routes/api');
require('dotenv').config();

const app = express();
const connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@9a.mongo.evennode.com:27017,9b.mongo.evennode.com:27017/${process.env.DB_USER}?replicaSet=eu-9`;
const options = { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true, };
mongoose.connect(connectionString, options);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB using chain: " + connectionString);
});

mongoose.connection.on('error', function (err) {
  console.log(err);
});

mongoose.connection.on('disconnected', function () {
  //  mongoose.connectToDatabase();
});

seedData();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist/mean-app')));

app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/mean-app/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
