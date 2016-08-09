// Determine whether we have unit tests or not
var environment = process.env.ENVIRONMENT,
    displayTests = false;
if (environment == "DEVELOP")
{
    var displayTests = true;        // Used for router creation
    tests = require('./tests.js');  // Contains unit tests
}

var http, director, cool, bot, router, server, port;

// Modules
http        = require('http');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');

// DEVELOP website
if (displayTests) {
    router = new director.http.Router({
    '/' : {
        // No post
        // View unit tests
        get: pingTests
    }
});
// PRODUCTION website
} else {
router = new director.http.Router({
    '/' : {
        // Post the bot's response
        post: bot.respond,
        // And display the web browser view
        get: ping
    }
});
}

// Get data from server call
server = http.createServer(function (req, res) {
    req.chunks = [];
        req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
    console.log(req[0]toSource());
    console.log(res[1]toSource());
    console.log(req[0]toSource());
    console.log(res[1]toSource());
    });

    router.dispatch(req, res, function(err) {
        res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
    });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

// Write website description to browser
function ping() {
  this.res.writeHead(200);
  this.res.end("<a href=\"https://github.com/heztet/groupme-jarvis\">GroupMe Jarvis Bot</a> by Nicky Marino");
}

// Write unit tests to browser
function pingTests() {
    // Load results from unit tests
    body = tests.run();

    this.res.writeHead(200);
    this.res.end(body);
}