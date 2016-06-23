var bot = require('./bot.js');

function run() {
	var testResults = [];
	testResults.push(testCommand("jarvis hello", "Hello!"));
	testResults.push(testCommand("jarvis help", "I'm sorry, but I can't do that right now"));
	testResults.push(testCommand("jarvis ahelpa", ""));
	return testResults.toString();
}

function testCommand(text, expected) {
	var result, botOutput, status;

	/* Check that request calls for bot response */ 
    // Has text
    if (text) {
        // Convert to lowercase and remove extra spaces
        text = text.toLowerCase().trim();

        // Has 'jarvis'
        var index = text.indexOf("jarvis");
        if (index > -1) {
            // Chop off jarvis from text
            var command = text.substring(index).trim();

            // Get response and post it
            botOutput = bot.getMessage(command);
        }
        // Does not have 'jarvis'
        else {
            botOutput = "Request didn't say my name!";
        }
    // No text
    } else {
        botOutput = "Request did not have text";
    }

    // Determine whether the test succeeded or failed
    if (botOutput === expected) {
    	status = "Passed";
    } else {
    	status = "Failed";
    }

    // Return array of test inputs and resutls
    result = [text, expected, botOutput, status];
    return result;
}

exports.run = run;