var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require("fs");
var config = require("./config");

function createDatabasesFolder() {
    if (!fs.existsSync(config.database.rootFolder)) {
        fs.mkdirSync(config.database.rootFolder);
    }
}
createDatabasesFolder();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memberSlotRouter = require('./routes/member-slot');
var memberDishRouter = require('./routes/member-dishes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/member-slot', memberSlotRouter);
app.use('/member-dishes', memberDishRouter);

module.exports = app;
