const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const fs = require('fs');
const glob = require( 'glob' );
const path = require('path');

//const archiver = require('archiver');
//const streamBuffers = require('stream-buffers');

function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

function postResult(options, pathGuid, vipRunId, status, steps, msg, screenshots) 
{
	var testPathRun = {};
	
	testPathRun.runTimeStamp = (new Date().getTime());
	testPathRun.testPathGuid = (pathGuid);
	
	testPathRun.testStatus = (status);
		
	testPathRun.message = (msg);
	testPathRun.jobId = options.jobId;
		
	testPathRun.testPathRunSteps = steps;
	
	testPathRun.vipRunId = vipRunId;
	
	testPathRun.attachments = [];
	for (var i = 0; i < screenshots.length; i++) {
		testPathRun.attachments.push(screenshots[i]);
	}
	
	var xmlhttp = new XMLHttpRequest();  

	var theUrl = options.apiEndpoint + "/api/apikey/" + options.apiKey + "/model/version/profile/testcollection/testsuite/testpath/run";

	xmlhttp.open("POST", theUrl, true);

	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	console.log("Posting result of " + status );	

	xmlhttp.onreadystatechange = function () {
		if (!(xmlhttp.status === 0 || (xmlhttp.status >= 200 && xmlhttp.status < 400))) {
			console.log("ERROR: Posting results to TestModeller");
			console.log(xmlhttp);
		} else if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
			console.log("Result successfully posted to TestModeller");		
		}
	};

	xmlhttp.send(JSON.stringify(testPathRun));
}

function configureDefaults(options) 
{
	console.log(options);

	options = options || {};
	options = options.reporterOptions || {};
	
	if (options.screenshotLocation == null) {
		options.screenshotLocation = "cypress/screenshots/";		
	}

	if (options.videoLocation == null) {
		options.videoLocation = "cypress/videos/";
	}

	return options;
}

function extractTestGuid(val) 
{
	const groups = /Guid="(?<token>[^ $]*)"\}/.exec(val)
	
	if (groups == null || groups.groups == null) 
		return null;
	
	return groups.groups.token;
}	

function getFileName(test)
{
	var curTest = test;
	while (curTest.file == null && curTest.parent != null) {
		curTest = curTest.parent;
	}
	
	if (curTest.file != null)
		return path.basename(curTest.file);
	
	return null;
}

function getScreenshots(_options, testName)
{
	var byteArr = [];
	
	glob.sync("./" + _options.screenshotLocation + "**/" + testName.replace(/["']/g, "") + "*.png").map(file => {
		byteArr.push({fileName: path.basename(file), file: getByteArray(file)});
	});
	
	return byteArr;
}

function getByteArray(filePath){
    let fileData = fs.readFileSync(filePath, {encoding: 'base64'});
	
	return fileData;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function(runner, options) 
{	
	var _options = configureDefaults(options);

	var lastTestName = null;
	
	var fileNames = [];
	
	var curStatus = "Passed";
	
	var curMessage = "";
	
	var testSteps = {};
	
	var vipRunId = uuidv4();

    runner.on('pass', function(test){
		if (lastTestName == null)
			lastTestName = test.parent.title
			
		if (lastTestName !== test.parent.title) {
			// Post result			
			var o = extractTestGuid(lastTestName);
			if (o != null) {
				postResult(_options, o, vipRunId, curStatus, testSteps[o], curMessage, getScreenshots(_options, lastTestName.replace(/["']/g, "")));
			}
									
			// Reset everything
			lastTestName = test.parent.title
			
			curStatus = "Passed";
			
			curMessage = "";
		}

		var curFileName = getFileName(test);
		if (curFileName != null && fileNames.indexOf(curFileName) < 0) 
			fileNames.push(curFileName);
		

		// Post step 
		var testGuid = extractTestGuid(test.parent.title);
		var stepGuid = extractTestGuid(test.title);

		if (testGuid != null) {
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
    });

    runner.on('fail', function(test, err){
		if (lastTestName == null)
			lastTestName = test.parent.title

		if (lastTestName !== test.parent.title) {
			// Post result			
			var o = extractTestGuid(lastTestName);
			if (o != null) {
				postResult(_options, o, vipRunId, curStatus, testSteps[o], curMessage, getScreenshots(_options, lastTestName.replace(/["']/g, "")));
			}						
			
			// Reset everything
			lastTestName = test.parent.title
		}

		curStatus = "Failed";
		
		curMessage = JSON.stringify(test.err.message);

		var curFileName = getFileName(test);
		if (curFileName != null && fileNames.indexOf(curFileName) < 0) 
			fileNames.push(curFileName);
	
		// Post step 
		var testGuid = extractTestGuid(test.parent.title);
		var stepGuid = extractTestGuid(test.title);

		if (testGuid != null) {
			if (testSteps[testGuid] == null)
				testSteps[testGuid] = [];
			
			testSteps[testGuid].push({
				stepDescription: test.title,
				testStatus: "Failed", 
				message: JSON.stringify(test.err.message), 
				//image, 
				nodeGuid: stepGuid
			});
		}
    });

    runner.on('end', function(){
		// Flush any hanging tests
		var o = extractTestGuid(lastTestName);
		if (o != null) {
			postResult(_options, o, vipRunId, curStatus, testSteps[o], curMessage, getScreenshots(_options, lastTestName.replace(/["']/g, "")));
		}
				
		// postRunCollection(_options, fileNames, vipRunId)
    });
};