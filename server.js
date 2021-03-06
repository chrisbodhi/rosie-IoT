// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');    // call express
var app        = express();         // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var dotenv     = require('dotenv');
var Schema     = mongoose.Schema;
var multer     = require('multer');
var Meal       = require('./app/models/meals');
var routes     = require('./routes');

// Prepare the .env environmental variables for local dev
dotenv.load();

var MONGOLAB_URI = process.env.MONGOLAB_URI;

// connect to DB, hosted on Heroku
// MONGOLAB_URI is defined in .env and in `heroku config`
mongoose.connect(MONGOLAB_URI);


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(multer({
  dest: './uploads/'
}));

var port = process.env.PORT || 8989;    // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();        // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8989/api)
router.get('/', function(req, res) {
  res.json({ message: 'Hooray! Welcome to our Crushinator!' }); 
});

// more routes for our API will happen here
router.route('/meals')

  // create a meal (accessed at POST http://localhost:8989/api/meals)
  .post(function(req, res) {
    
    var meal = new Meal();    // create a new instance of the Meal model
    meal.name = req.body.name;  // set the meals name (comes from the request)
    meal.weight = req.body.weight;
    meal.image = req.body.image;
    meal.taken = req.body.taken;

    // save the meal and check for errors
    meal.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Meal created!', pic: 'meal.picture' });
    });
    
  })

  // get all the meals (accessed at GET http://localhost:8989/api/meals)
    .get(function(req, res) {
      Meal.find(function(err, meals) {
        if (err)
          res.send(err);

        res.json(meals);
      });
    });


// REGISTER OUR ROUTES -------------------------------

// app.configure(function(){
//   app.set('app', __dirname + '/app');
//   app.set('view engine', 'html');
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(express.static(__dirname + '/public'));
//   app.use(app.router);
// });

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/app'));
// app.use(express.static(__dirname + '/app/styles'));
app.get('/', function(req, res){
  res.sendFile('app/index.html');
});
// app.get('*', function(req, res){
//   res.sendFile('app/index.html');
// });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
