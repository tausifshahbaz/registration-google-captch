const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
var dotenv = require('dotenv');
var sass = require('node-sass-middleware');
var cron = require('node-cron');

dotenv.config({ path: '.env' });

mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(cb){
    console.log("Mongo Connection Successful.");
});

/**
 * Controllers (route handlers).
 */
const loginController = require('./controller/login');


const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('appRoot', path.join(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(express.static(__dirname + '/public'));



app.get('/', loginController.index);
app.post('/postData', loginController.registerUser);
app.post('/checkCount', loginController.checkIp);


app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


cron.schedule('59 59 23 * * * * *', () => {
    console.log('running everyday at 23.59.59');
    loginController.setIpCount();
});


module.exports = app;





