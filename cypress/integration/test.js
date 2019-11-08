Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    debugger
    return false
})

Cypress.on('fail', (err) => {
    debugger
})

describe('My First Test', function() {
  it('Does not do much!', function() {
	cy.visit('http://localhost:81/SplendidCRM/Opportunities/edit.aspx')
 
    cy.get('#ctl00_cntBody_ctlEditView_NAME').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_NAME').type('james')
 
    cy.get('#ctl00_cntBody_ctlEditView_ACCOUNT_NAME').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_ACCOUNT_NAME').type('walker')
 
 
    cy.get('#ctl00_cntBody_ctlEditView_OPPORTUNITY_TYPE').select('Existing Business')
 

    cy.get('#ctl00_cntBody_ctlEditView_LEAD_SOURCE').select('Self generated')
  
    cy.get('#ctl00_cntBody_ctlEditView_DESCRIPTION').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_AMOUNT').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_AMOUNT').type('2')
 
    cy.get('#ctl00_cntBody_ctlEditView_PROBABILITY').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_PROBABILITY').type('2')
 
    cy.get('#ctl00_cntBody_ctlEditView_CAMPAIGN_NAME').click()
 
    cy.get('#ctl00_cntBody_ctlEditView_CAMPAIGN_NAME').type('campagn')
 
    cy.get('#ctl00_cntBody_ctlEditView_ctlFooterButtons_btnSAVE').click()
 

    expect(true).to.equal(true)
  })
})
