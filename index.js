const express = require('express');
const app = express();
const path = require('path');
const { auth } = require('express-openid-connect');
var methodOverride = require('method-override')
const http = require('http');

const pg = require('pg');
const db = require('./db');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const indexRouter = require('./routes/index.routes');
const datatableRouter = require('./routes/datatable.routes');
const { nextTick } = require('process');

//login 
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '_iAsXQ4-2LdFKVH63JWG3ACBq5pCUJix92l3h5ha0Tk1QrqpdKo7cXjLcFfWb8BC',
  baseURL: 'http://localhost:3000',
  clientID: 'MaHUO5AMkIj1PfUGlP54TiqPVQvfg7ki',
  issuerBaseURL: 'https://dev-u4bh3lb9.us.auth0.com'
};
app.use(auth(config));

//ejs views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//statički resursi
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(methodOverride('_method'));
//rute
app.use('/', indexRouter);
app.use('/datatable', datatableRouter);
app.use(express.urlencoded({ extended: true }));

app.listen(3000);