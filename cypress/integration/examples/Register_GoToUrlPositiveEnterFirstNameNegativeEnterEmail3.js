Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    debugger
    return false
})

Cypress.on('fail', (err) => {
    debugger
})



describe("GoToUrlPositiveEnterFirstNameNegativeEnterEmail3", function() {
   it("GoToUrlPositiveEnterFirstNameNegativeEnterEmail3", function() {
 	
 	cy.visit('https://magento.nublue.co.uk/customer/account/create/')

cy.xpath("//*[@id='firstname']").type("assumenda")

cy.xpath("//*[@id='email_address']").type("")

   })
})

