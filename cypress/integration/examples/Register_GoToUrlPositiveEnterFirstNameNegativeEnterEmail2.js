Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    debugger
    return false
})

Cypress.on('fail', (err) => {
    debugger
})



describe("GoToUrlPositiveEnterFirstNameNegativeEnterEmail2", function() {
   it("GoToUrlPositiveEnterFirstNameNegativeEnterEmail2", function() {
 	
 	cy.visit('https://magento.nublue.co.uk/customer/account/create/')

cy.xpath("//*[@id='firstname']").type("quia")

cy.xpath("//*[@id='email_address']").type("james.walker")

   })
})

