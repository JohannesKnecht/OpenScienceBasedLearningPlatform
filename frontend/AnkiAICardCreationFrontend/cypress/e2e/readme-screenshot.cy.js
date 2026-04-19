describe('README screenshot', () => {
  it('captures the graph view', () => {
    cy.viewport(2048, 991)
    cy.visit('/graph')
    cy.contains('h1', 'All lessons, one map')
    cy.get('#app').screenshot('readme-graph')
  })
})
