Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    debugger
    return false
})

Cypress.on('fail', (err) => {
    debugger
})



describe("GoToUrlNegativeEnterFirstName4", function() {
   it("GoToUrlNegativeEnterFirstName4", function() {
 	
 	cy.visit('https://magento.nublue.co.uk/customer/account/create/')

cy.xpath("//*[@id='firstname']").type("389348")

   })
})

