const express = require('express');
const app = express();
const path = require('path');
var methodOverride = require('method-override')

const pg = require('pg');
const db = require('./db');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const indexRouter = require('./routes/index.routes');
const datatableRouter = require('./routes/datatable.routes');

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