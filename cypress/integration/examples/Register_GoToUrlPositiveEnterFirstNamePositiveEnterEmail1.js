Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    debugger
    return false
})

Cypress.on('fail', (err) => {
    debugger
})



describe("GoToUrlPositiveEnterFirstNamePositiveEnterEmail1", function() {
   it("GoToUrlPositiveEnterFirstNamePositiveEnterEmail1", function() {
 	
 	cy.visit('https://magento.nublue.co.uk/customer/account/create/')

cy.xpath("//*[@id='firstname']").type("iste")

cy.xpath("//*[@id='email_address']").type("james.walker@curiosity.software")

   })
})

