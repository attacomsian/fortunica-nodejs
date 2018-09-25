const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//load configuration
const config = require('./config');

//create express api
const app = express();

// connect to mongodb database at mLab
const db = process.env.NODE_ENV === 'test' ? config.mongoTestUrl : config.mongoUrl;
mongoose.connect(
    db,
    {useNewUrlParser: true}) //need this for api support
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

//load models
const User = require('./api/models/user');
const Client = require('./api/models/client');
const Question = require('./api/models/question');
const Answer = require('./api/models/answer');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests for dev environment
if(process.env.NODE_ENV !== 'test'){
    app.use(morgan('dev'));
}

//Add CORS
app.use(cors({
    maxAge: 3600 //cache request for one hour
}));

//register all routes
const routes = require('./api/routes/fortunica');
routes(app, express);

//error handling 4x and 5x
app.use((req, res) => {
    res.status(404).json({message: req.originalUrl + ' not found'})
});

app.use((err, req, res, next) => {
    res.status(500).send({err});
});

//start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Fortunica api is listening at : ' + port);
});

module.exports = app; // for testing