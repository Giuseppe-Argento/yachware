describe('dashboard-app', () => {
  const mockDevices = [
    {
      "id": 1,
      "name": "Arlo Pro",
      "type": "Security Camera",
      "location": "Office",
      "currentState": "off",
      "temperature": "27.6°C",
      "humidity": "30.4%"
    },
    {
      "id": 2,
      "name": "Amazon Echo",
      "type": "Smart Speaker",
      "location": "Office",
      "currentState": "on",
      "temperature": "20.4°C",
      "humidity": "48.6%",
      "volume": 5
    },
  ];

  // Test for initial rendering
  it('renders the default elements on the screen', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="cypress-title"]')
      .should('exist')
      .should('have.text', 'Smart Home');
  });

  // Test for rendering the device cards
  it('renders cards on the screen', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="cypress-list"]').should('exist');
  });

  // Test for fetching and displaying devices correctly
  it('fetches and displays devices on page load', () => {
    // Mock the GET request for fetching devices
    cy.intercept('GET', '/api/devices', {
      statusCode: 200,
      body: mockDevices
    }).as('getDevices');

    // Visit the page
    cy.visit('http://localhost:3000/');

    // Wait for the GET request to complete
    cy.wait('@getDevices');

    // Check that the devices are rendered correctly
    cy.get('[data-testid="cypress-list"]')
      .should('have.length', 2)
      .eq(0)
      .should('contain.text', 'Arlo Pro')
      .and('contain.text', 'Office');

    cy.get('[data-testid="cypress-list"]')
      .eq(1)
      .and('contain.text', 'Amazon Echo')
      .and('contain.text', 'Smart Speaker');
  });

 
  // Test for grouping devices by location
  it('groups devices by location when the button is clicked', () => {
    cy.visit('http://localhost:3000/');

    // Mock device data with locations
    const groupedDevices = [
      {
        id: 1,
        name: 'Arlo Pro',
        type: 'Security Camera',
        location: 'Living Room',
        currentState: 'off',
      },
      {
        id: 2,
        name: 'Amazon Echo',
        type: 'Smart Speaker',
        location: 'Office',
        currentState: 'on',
      },
    ];

    // Mock the GET request for fetching devices
    cy.intercept('GET', '/api/devices', {
      statusCode: 200,
      body: groupedDevices,
    }).as('getDevices');

    cy.wait('@getDevices');

    // Click on the 'Group by Location' button
    cy.get('button').contains('Group by Location').click();

    // Verify that devices are grouped correctly
    cy.get('[data-testid="cypress-list"]').should('have.length', 2);

    // Verify grouping by location
    cy.get('h2').contains('Living Room');
    cy.get('h2').contains('Office');
  });
});
