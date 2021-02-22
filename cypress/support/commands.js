Cypress.Commands.add("performAllocation", (poolName, allocationTypes) => {
	cy.task('performAllocation', { poolName: poolName, allocationTypes: allocationTypes});
});

Cypress.Commands.add("retrieveAllocationResult", (poolName, suiteName, testName) => {
	return cy.task('retrieveResult', { poolName: poolName, suiteName: suiteName, testName: testName});
});