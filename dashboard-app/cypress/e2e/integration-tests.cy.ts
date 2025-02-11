// integration-tests.cy.ts

describe('Integration Tests', () => {

    // Test: Fetching and Displaying Devices
    it('fetches and displays devices on page load', () => {
      const mockDevices = [
        { id: 1, name: 'Arlo Pro', type: 'Security Camera', location: 'Office', currentState: 'off' },
        { id: 2, name: 'Amazon Echo', type: 'Smart Speaker', location: 'Office', currentState: 'on', volume: 5 },
      ];
  
      // Intercept the GET request to mock API response
      cy.intercept('GET', '/api/devices', {
        statusCode: 200,
        body: mockDevices
      }).as('getDevices');
  
      // Visit the page and wait for the request to complete
      cy.visit('http://localhost:3000/');
      cy.wait('@getDevices');
  
      // Check if the devices are correctly rendered
      cy.get('[data-testid="cypress-list"]')
        .should('have.length', 2)
        .eq(0)
        .should('contain.text', 'Arlo Pro')
        .and('contain.text', 'Office');
  
      cy.get('[data-testid="cypress-list"]')
        .eq(1)
        .should('contain.text', 'Amazon Echo')
        .and('contain.text', 'Smart Speaker');
    });
  
    // Test: Grouping Devices by Location
    it('groups devices by location when the button is clicked', () => {
      const groupedDevices = [
        { id: 1, name: 'Arlo Pro', type: 'Security Camera', location: 'Living Room' },
        { id: 2, name: 'Amazon Echo', type: 'Smart Speaker', location: 'Office' },
      ];
  
      // Intercept the GET request to mock API response
      cy.intercept('GET', '/api/devices', {
        statusCode: 200,
        body: groupedDevices,
      }).as('getDevices');
  
      // Visit the page and wait for the request to complete
      cy.visit('http://localhost:3000/');
      cy.wait('@getDevices');
  
      // Click the 'Group by Location' button to trigger the grouping functionality
      cy.get('button').contains('Group by Location').click();
  
      // Verify that devices are grouped by location correctly
      cy.get('[data-testid="cypress-list"]').should('have.length', 2);
      cy.get('h2').contains('Living Room');
      cy.get('h2').contains('Office');
    });
  
  });
  