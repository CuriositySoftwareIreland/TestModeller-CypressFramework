var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function postResult(options, pathGuid, status, steps, msg) 
{
	var testPathRun = {};
	
	testPathRun.runTimeStamp = (new Date().getTime());
	testPathRun.testPathGuid = (pathGuid);

			console.log("Posting result " + status);
	
	testPathRun.testStatus = (status);
	
	testPathRun.testPathRunSteps = (steps);
	
	testPathRun.message = (msg);
		
	testPathRun.testPathRunSteps = steps;
	
	var xmlhttp = new XMLHttpRequest();  

	var theUrl = options.apiEndpoint + "/api/apikey/" + options.apiKey + "/model/version/profile/testcollection/testsuite/testpath/run";

	xmlhttp.open("POST", theUrl);

	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	xmlhttp.onreadystatechange = function () {
		if (!(xmlhttp.status === 0 || (xmlhttp.status >= 200 && xmlhttp.status < 400))) {
			console.log(xmlhttp);
		} 
	};

	xmlhttp.send(JSON.stringify(testPathRun));
}

function configureDefaults(options) 
{
	console.log(options);

	options = options || {};
	options = options.reporterOptions || {};


	return options;
}

function extractTestGuid(val) 
{
	const groups = /Guid="(?<token>[^ $]*)"\}/.exec(val)
	
	if (groups == null || groups.groups == null) 
		return null;
	
	return groups.groups.token;
}	

module.exports = function(runner, options) 
{	
	var _options = configureDefaults(options);

	var lastTestName = null;
	
	var curStatus = "Passed";
	
	var testSteps = {};

    runner.on('pass', function(test){
		if (lastTestName == null)
			lastTestName = test.parent.title
			
		if (lastTestName !== test.parent.title) {
			// Post result			
			var o = extractTestGuid(lastTestName);
			if (o != null) {
				postResult(_options, o, curStatus, testSteps[o], "");
			}						
			
			console.log(lastTestName + " " + curStatus);
						
			// Reset everything
			lastTestName = test.parent.title
			
			curStatus = "Passed";
		}
		
		// Post step 
		var testGuid = extractTestGuid(test.parent.title);
		var stepGuid = extractTestGuid(test.title);

		if (testGuid != null && stepGuid != null) {
			if (testSteps[testGuid] == null)
				testSteps[testGuid] = [];
			
			testSteps[testGuid].push({
				stepDescription: test.title,
				testStatus: "Passed", 
				//message, 
				//image, 
				nodeGuid: stepGuid
			});
		}

		//console.log("Pass - " + test.title);
    });

    runner.on('fail', function(test, err){
		if (lastTestName == null)
			lastTestName = test.parent.title

		if (lastTestName !== test.parent.title) {
			// Post result			
			var o = extractTestGuid(lastTestName);
			if (o != null) {
				postResult(_options, o, curStatus, testSteps[o], "");
			}						
			
			console.log(lastTestName + " " + curStatus);
			
			// Reset everything
			lastTestName = test.parent.title

			curStatus = "Failed";
		}
		
		// Post step 
		var testGuid = extractTestGuid(test.parent.title);
		var stepGuid = extractTestGuid(test.title);

		if (testGuid != null && stepGuid != null) {
			if (testSteps[testGuid] == null)
				testSteps[testGuid] = [];
			
			testSteps[testGuid].push({
				stepDescription: test.title,
				testStatus: "Failed", 
				message: JSON.stringify(test.err), 
				//image, 
				nodeGuid: stepGuid
			});
		}

		//console.log("Fail - " + test.title);
    });

    runner.on('end', function(){
		console.log("Flushing test - " + lastTestName +  " " + curStatus)
		var o = extractTestGuid(lastTestName);
		if (o != null) {

			postResult(_options, o, curStatus, testSteps[o], "");
		}	else					 {
			console.log("null");
		}

        console.log("Finished Suite");
    });
};