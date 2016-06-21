// Modules
var HTTPS = require('https');
var cool = require('cool-ascii-faces');

// Get the Bot Id
var botID = process.env.BOT_ID;

// Get request and post response
function respond() {
  // User post
  var request = JSON.parse(this.req.chunks[0]),
      coolRegex = /^\/cool guy$/; // Command '/cool guy'

  // '/cool guy'
  //if(request.text && coolRegex.test(request.text)) {
  if (request.text && (equest.text.indexOf("/cool guy") > -1)) {
    this.res.writeHead(200);
    var response = cool();
    postMessage(response);
    this.res.end();
  // ''
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

// Post message to GroupMe
function postMessage(botResponse) {
  var options, body, botReq;

  // Set post
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };
  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  // Write log (good or bad) to console
  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;