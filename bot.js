// Modules
var HTTPS = require('https');
var coolGuy = require('cool-ascii-faces');
var natural = require('natural'),
    tokenizer = new natural.WordTokenizer();

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
        console.log("Message received: \"" + text + "\" from \"" + request.name + "\"");

        // Has 'jarvis'
        var index = text.indexOf("jarvis");
        if (index > -1) {
            // Chop off jarvis from text
            var command = text.substring(index).trim();

            // Get response and post it
            var response = getMessage(command, request.name);
            if (response) {
                this.res.writeHead(200);
                postMessage(response);
                this.res.end();
            }      
        }
        // Does not have 'jarvis'
        else {
            console.log("Request didn't say my name!")
            this.res.writeHead(200);
            this.res.end();
        }
    // No text
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

// Determine appropriate response for the message sent to Jarvis
function getMessage(request, sender) {
    // Convert command to lowercase and trim
    var commandStr = request.toLowerCase().trim();
    // Make command an array of tokens (words)
    command = tokenizer.tokenize(commandStr);

    var response = "";

    ///// BASIC CALL/RESPONSE MESSAGES  /////
    // [Blank or null command]
    if (sender == "Aaron Zych" && commandStr.contains("?")) {
        response = "Of course, Sir";
    // Google
    } else if (command.contains("google")) {
        // Strip google from the commandStr
        var searchStr = commandStr.substring(commandStr.indexOf("google") + 7);
        // Return first result
        response = googleSearch(searchStr, 1);
    // 'hi' or 'hello'
    } else if (command.contains("hi") || command.contains("hello")) {
        response = "Hello!";
    // 'help'
    } else if (command.contains("help")) {
        response = "I'm sorry, but I can't do that right now";
    // 'weather'
    } else if (command.contains("weather")) {
        response = "It should be sunny right now, but because it's Indiana I am unsure";
    // 'cool guy'
    } else if (command.contains("cool guy")) {
        response = coolGuy();
    // 'cool'
    } else if (command.contains("cool")) {
        // 'alex' (not 'kranz')
        if (command.contains("alex") && !command.contains("kranz")) {
            response = "Of course not!";
        } else {
            response = "It's 98 percent likely, yes";
        }
    // [Unknown command]
    } else {
        response = "";
    }

    return response;
}

// Search google for string and return the first result
var searchResults = ['test'];     // global var quick fix for seraching
function googleSearch(search, numResults) {
    var google = require('google');
    google.resultsPerPage = 25;
    var nextCounter = 0;

    google('node.js best practices', function (err, res){
        if (err) console.error(err)

        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            searchResults.push(link.title + ' - ' + link.href)
            searchResults.push(link.description + "\n")
        }

        if (nextCounter < 4) {
            nextCounter += 1
            if (res.next) res.next()
        }

        //console.log(searchResults);

    })
    console.log(searchResults);
}

// Check if subStr exists in a string
String.prototype.contains = function (subStr) {
    if (this.indexOf(subStr) > -1) {
        return 1;
    }
    return 0;
}

// Check if value exists in an array
Array.prototype.contains = function (value) {
    return this.indexOf(value) > -1;
}

exports.respond = respond;
exports.getMessage = getMessage;