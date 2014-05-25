/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var https = require('https');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var Future = require('futures').future;
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');

var secrets = require('./config/secrets');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF Whitelist
 */


/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Application routes.
 */

PearsonApis = require('./pearson_sdk.js');
var request = require ('request');

var api = PearsonApis.dictionaries(); // Sets up travel api object, no apikey/sandbox access.
var entries = api.entries; // gets the topten endpoint to query
var searchTerms = { search: "restaurant" }

console.log = (searchTerms);

var searchEntries = entries.getSearchUrl(searchTerms); // This constructs the url with all supplied search parameters and limitations

request(searchEntries, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var res = JSON.parse(body);
  }
});
// This uses the request library to do the fetch from index.js

var getSearchNow = entries.search(searchTerms);
app.get('/', homeController.index);
app.get('/search', function(req, res) {
    res.render('query');
	var searchCommand = req.query.command;
	
	var request_wit = function(user_text) {
    	var future = Future.create();
    	var options = {
        	host: 'api.wit.ai',
        	path: '/message?v=20140524&q=' + searchCommand,
        	// the Authorization header allows you to access your Wit.AI account
        	// make sure to replace it with your own
        	headers: {'Authorization': 'Bearer 4WIP3W3H3EHWXQ2ABINW3XLYY64JKWGS'}
    	};

    	https.request(options, function(res) {
    		var response ='';
        	res.on('data', function (chunk) {
            	response += chunk;
        	});

        	res.on('end', function () {
            	future.fulfill(undefined, JSON.parse(response));
        	});
    	}).on('error', function(e) {
        	future.fulfill(e, undefined);
    	}).end();

    	return future;
		}	
        var wit_response = JSON.parse(request_wit(searchCommand));

    var intent = wit_response.intent;
    var value;
    if (intent == 'get_info') {
        value = wit_response.info_about_what.value;
    }
    if (intent == 'get_picture') {
        value = wit_response.picture_of_what.value;
    }
    if (intent == 'definition') {
        value = wit_response.def_of_what.value;
     }
});

app.get('/search/:unixcommand', function(req, res) {
    var searchCommand = req.query.command;
    
    var request_wit = function(user_text) {
        var future = Future.create();
        var options = {
            host: 'api.wit.ai',
            path: '/message?v=20140524&q=' + searchCommand,
            // the Authorization header allows you to access your Wit.AI account
            // make sure to replace it with your own
            headers: {'Authorization': 'Bearer FPSR4MDXNAHLC75JSZ3ZAFCP66N6IFXY'}
        };

        https.request(options, function(res) {
            var response ='';
            res.on('data', function (chunk) {
                response += chunk;
            });

            res.on('end', function () {
                future.fulfill(undefined, JSON.parse(response));
            });
        }).on('error', function(e) {
            future.fulfill(e, undefined);
        }).end();

        return future;
        }   
    var wit_response = request_wit(searchCommand);
    
    wit_response.when(function(err, response) {
        if (err) console.log(err); // handle error here
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log("swag", app.get('port'), app.get('env'));
        //res.end(JSON.stringify(response));
    });


});



/**
 * 500 Error Handler.
 * As of Express 4.0 it must be placed at the end, after all routes.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;
