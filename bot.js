// Modules
var HTTPS = require('https');
var cool = require('cool-ascii-faces');

// Get the Bot Id
var botID = process.env.BOT_ID;

// Get request and post response
function respond() {
    // User post
    var request = JSON.parse(this.req.chunks[0]);

    /* Check that request calls for bot response */ 
    // Has text
    if (request.text) {
        // Convert to lowercase and remove extra spaces
        var text = request.text.toLowerCase().trim();

        // Record request
        console.log("Message received: " + text);

        // Has 'jarvis'
        var index = text.indexOf("jarvis");
        if (index > -1) {
            // Chop off jarvis from text
            var command = text.substring(index).trim();

            // Get response and post it
            var response = getMessage(command);
            this.res.writeHead(200);
            postMessage(response);
            this.res.end();
        }
        else {
            console.log("Request didn't say my name!")
            this.res.writeHead(200);
            this.res.end();
        }
    } else {
        console.log("Request did not have text");
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

    // Write to console
    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
    });

    // Catch errors
    botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function getMessage(command) {
    // Convert command to lowercase and trim
    command = command.toLowerCase().trim();
    var response = "";

    // [Blank or null command]
    if ((!command || 0 === command.length)) {
        response = "How may I assist you?";
    // 'hi' or 'hello'
    } else if (command.contains("hi") || command.contains("hello")) {
        response = "Hello!";
    // 'help'
    } else if (command.contains("help")) {
        response = "I'm sorry, but I can't do that right now";
    // 'weather'
    } else if (command.contains("weather")) {
        response = "It should be sunny right now, but because it's Indiana I am unsure";
    // 'cool'
    } else if (command.contains("cool")) {
        // 'alex'
        if (command.contains("alex") && !command.contains("kranz")) {
            response = "Of course not!";
        } else {
            response = "It's 98 percent likely, yes";
        }
    // [Unknown command]
    } else {
        response = "I don't understand, Sir/Madam";
    }

    return response;
}

// Check if subStr exists in a string
String.prototype.contains = function (subStr) {
    if (this.indexOf(subStr) > -1) {
        return 1;
    }
    return 0;
}

exports.respond = respond;