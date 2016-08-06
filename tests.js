var bot = require('./bot.js');

// Run a series of tests and return the results in HTML format
function run() {
    // Create a table with headers
	var testResults = [];
    testResults.push("<table><tr><th>Input</th><th>Expected</th><th>Output</th><th>Status</th></tr>");
    
    // Run tests
	testResults.push(testCommand("", "Request did not have text"));
	testResults.push(testCommand("no bot mentioned here", "Request didn't say my name!"));
	testResults.push(testCommand("jarvis hello", "Hello!"));
	testResults.push(testCommand("jarvis help", "I'm sorry, but I can't do that right now"));
	testResults.push(testCommand("jarvis ahelpa", ""));
	testResults.push(testCommand("jarvis weather", "It should be sunny right now, but because it's Indiana I am unsure"));
	testResults.push(testCommand("jarvis is alex cool?", "Of course not!"));
	testResults.push(testCommand("jarvis is alexander cool?", "It's 98 percent likely, yes"));
	testResults.push(testCommand("jarvis nicky cool?", "It's 98 percent likely, yes"));
    
    // Finish the table and return
    testResults.push("</table>");
	return testResults.join("");
}

// Run a command through jarvis, run analysis and return results in HTML
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

    // Return HTML of test inputs and resutls
    result = ["<tr><td>", text, "</td><td>", expected, "</td><td>", botOutput, "</td><td>", status, "</td></tr>"].join("");
    return result;
}

exports.run = run;