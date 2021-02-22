const deasync = require('deasync');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const url = "http://localhost:8080";
const apiKey = "PtYawE1NRkqBmf4dy3tY6kJW5";
const serverName = "DESKTOP-3FUJ8B9";

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
    on('task', {
		performAllocation ({ poolName, allocationTypes }) {
			return new Promise((resolve, reject) => {
				// Perform allocation
				var xmlhttp = new XMLHttpRequest();  
				var theUrl = url + "/api/apikey/" + apiKey + "/allocation-pool/" + poolName + "/resolve/server/" + serverName + "/execute";

				xmlhttp.open("POST", theUrl, true);
				xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

				var jobId = null;
				xmlhttp.onreadystatechange = function () {
					if (!(xmlhttp.status === 0 || (xmlhttp.status >= 200 && xmlhttp.status < 400))) {
						console.log("TestModeller Allocation ERROR");
						console.log(xmlhttp);

						return reject(xmlhttp.status);
					} else if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
						console.log("TestModeller Allocation - Job created successfully");

						var rspObj = JSON.parse(xmlhttp.responseText);					

						jobId = rspObj.id;

						console.log("Created allocation job with ID: " + jobId);
											
						// Wait for job to finish
						while (true) {
							var theUrl = url + "/api/apikey/" + apiKey + "/job/" + jobId;

							var jobXmlhttp = new XMLHttpRequest();  
							jobXmlhttp.open("GET", theUrl, true);
							jobXmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

							jobXmlhttp.onreadystatechange = function () {
								if (!(jobXmlhttp.status === 0 || (jobXmlhttp.status >= 200 && jobXmlhttp.status < 400))) {
									console.log("TestModeller Allocation - ERROR");
									console.log(jobXmlhttp);

									return reject("");									
								} else if (jobXmlhttp.status == 200 && jobXmlhttp.readyState == 4) {
									var rspObj = JSON.parse(jobXmlhttp.responseText);
									
									if (rspObj.jobState == "Complete") {
										resolve(rspObj.id);		

										return;
									} else if (rspObj.jobState == "Error") {
										return reject("");
									}
									
									console.log("Allocation Progress: " + rspObj.jobState);
								}
							}
							
							jobXmlhttp.send();

							deasync.sleep(2000);
						}
					}
				}

				xmlhttp.send(JSON.stringify(allocationTypes));
			});
		}
  }),
  
  on('task', {
		retrieveResult({ poolName, suiteName, testName}) {
			return new Promise((resolve, reject) => {
				var mergeMethod = "NoMerge"
				
				var dataLookup = {pool: poolName, suite: suiteName, testName: testName}
				
				var lookupURL = url + "/api/apikey/" + apiKey + "/allocation-pool/suite/allocated-test/result/value?mergeMethod=" + mergeMethod
								
				var xmlhttp = new XMLHttpRequest();  				
				xmlhttp.open("POST", lookupURL, true);
				xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

				xmlhttp.onreadystatechange = function () {
					if (!(xmlhttp.status === 0 || (xmlhttp.status >= 200 && xmlhttp.status < 400))) {
						console.log("Allocation Retrieve Data - ERROR");
						console.log(xmlhttp);

						return reject("");
					} else if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
						var rspObj = JSON.parse(xmlhttp.responseText);

						console.log(rspObj);

						resolve(rspObj);		
					}
				}
				
				xmlhttp.send(JSON.stringify(dataLookup));
			});
		}
  })  
}
