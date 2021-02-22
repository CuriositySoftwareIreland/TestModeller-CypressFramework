describe('GoToUrlPositiveEnterFirstName1', function() {
	// 1) Before Tests -> Perform allocation
	before(() => {
		var poolName = "SuperStore";
		
		var allocationTypes = [{poolName: poolName, suiteName: "Store data", allocationTestName: "Superstore1:::Store data_Customer Name;Store data_Order ID"}]

		cy.performAllocation(poolName, allocationTypes);
	})

    it("GoToUrlPositiveEnterFirstName1", function() {		
		// 2) Retrieve result
		cy.retrieveAllocationResult("SuperStore", "Store data", "Superstore1:::Store data_Customer Name;Store data_Order ID")
		.then((allocResult) => {
			// 3) Perform Automation
			console.log(allocResult);

		})
	})
})
