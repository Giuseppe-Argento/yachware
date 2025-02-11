// unit-tests.cy.ts

describe('Unit Tests', () => {

    // Test: Rendering Default Title
    it('renders the default title', () => {
      cy.visit('http://localhost:3000/');
      cy.get('[data-testid="cypress-title"]')
        .should('exist')
        .should('have.text', 'Smart Home');
    });
  
    // Test: Rendering Device Cards Component
    it('renders device cards on the screen', () => {
      cy.visit('http://localhost:3000/');
      cy.get('[data-testid="cypress-list"]').should('exist');
    });
  
   
  
  });
  