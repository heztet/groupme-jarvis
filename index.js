var http, director, cool, bot, router, server, port;

// Modules
http        = require('http');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');

// When website is accessed
router = new director.http.Router({
  '/' : {
    // Post the bot's response
    post: bot.respond,
    // And display the web browser view
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("<a href=\"https://github.com/heztet/groupme-jarvis\">GroupMe Jarvis Bot</a> by Nicky Marino");
}