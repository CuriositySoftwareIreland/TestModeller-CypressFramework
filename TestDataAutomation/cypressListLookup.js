describe('My First Test', () => {
  it('Does not do much!', () => {
	var params = new Object()
	params["parAge"] = 30;
	params["parGender"] = 'Male'
	cy.task('getTestCriteriaListData', {catalogueId: 1, criteriaId: 282, params: params }).then((rsp) => {
        cy.log(rsp);
		cy.log(rsp[0].SSN)
		cy.log(rsp[0].Age)
		cy.log(rsp[0].Gender)
    });
  })
})
