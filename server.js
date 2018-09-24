const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//load configuration
const config = require('./config');

//create express app
const app = express();

// connect to mongodb database at mLab
mongoose.connect(
    config.mongoUrl,
    {useNewUrlParser: true}) //need this for api support
    .then(() => console.log("mongoDB connected"))
    .catch(err => console.log(err));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//Add CORS
app.use(cors({
    maxAge: 3600 //cache request for one hour
}));

app.get('/', (req, res) => {
    res.send("hello!!!");
});

//error handling 4x and 5x
app.use((req, res) => {
    res.status(404).send({success: false, message: req.originalUrl + ' not found'})
});

app.use((err, req, res, next) => {
    res.status(500).send({success: false, message: 'Interval server error', data: err});
});

//start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Fortunica is listening at : ' + port);
});
