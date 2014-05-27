/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var https = require('https');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Application routes.
 */

app.get('/', homeController.index);
app.get('/search', function(req, res) {
    //res.render('query');
    var searchCommand = req.query.command.split("+").join("%20");
    
    var request_wit = function(user_text) {
        var future = Future.create();
        var options = {
            host: 'api.wit.ai',
            path: '/message?v=20140524&q=' + encodeURIComponent(searchCommand),
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
        //res.end(JSON.stringify(response));
        var intent = response.outcome.intent;

        if (intent == 'list' && response.outcome.entities.what_to_list.value == 'files') {
            res.end('ls');
        }
        else if (intent == 'list' && response.outcome.entities.what_to_list.value == 'all files') {
            res.end('ls -a');
        }
        else if (intent == 'remove' && response.outcome.entities.what_to_delete.value.indexOf('.') != -1) {
            res.end('rm ' + response.outcome.entities.what_to_delete.value);
        }
        else if (intent == 'remove' && response.outcome.entities.what_to_delete.value.indexOf('.') == -1) {
            res.end('rm -rf ' + response.outcome.entities.what_to_delete.value);
        }
        else if (intent == 'navigate' && response.outcome.entities.where_to_go.value == 'up two directories') {
            res.end('cd ...');
        }
        else if (intent == 'navigate' && response.outcome.entities.where_to_go.value == 'root') {
            res.end('cd /');
            //res.render('result', {result: 'cd /'})
        }
        else if (intent == 'navigate' && response.outcome.entities.where_to_go.value == 'up a directory') {
            res.end('cd ..');
        }
        else if (intent == 'git_branch') {
            res.end('git checkout -b ' + response.outcome.entities.branch_name.value);
        }
        else if (intent == 'git_add' && response.outcome.entities.what_to_gitadd.value != 'all files') {
            res.end('git add ' + response.outcome.entities.what_to_gitadd.value);
        }
        else if (intent == 'git_add' && response.outcome.entities.what_to_gitadd.value == 'all files') {
            res.end('git add *');
        }
        else if (intent == 'Install' && response.outcome.entities.what_to_install.value.indexOf('.gz') != -1) {
            res.end('tar -xvzf ' + response.outcome.entities.what_to_install.value + '\n' + 'cd ' + 
                response.outcome.entities.what_to_install.value.substring(0, response.outcome.entities.what_to_install.value.length - 3) +
                 '\n' + './configure\n' + 'make\n' + 'sudo make install\n');
        }
        else if (intent == 'create_rails') {
            res.end('rails new ' + response.outcome.entities.name_of_railsapp.value);
        }
        else if (intent == 'rails_install') {
            res.end('bundle install');
        }
        else if (intent == 'start_rails') {
            res.end('rails s');
        }
        else if (intent == 'rails_migrate') {
            res.end('rake db:migrate');
        }
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
    console.log("Running");
});

module.exports = app;
