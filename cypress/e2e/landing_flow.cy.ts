describe('Landing Page & Navigation Flow', () => {
  beforeEach(() => {
    // Visit the application (uses baseUrl from cypress.config.ts)
    cy.visit('/');
  });

  it('Should display the hero section with correct title', () => {
    // Verify main title parts
    cy.contains('h1', 'Aprende sin').should('be.visible');
    cy.contains('span', 'límites').should('be.visible');

    // Verify "Explore Courses" button exists with correct link
    cy.contains('a', 'Explorar Cursos')
      .should('be.visible')
      .and('have.attr', 'href', '/courses');
  });

  it('Should navigate to Login page when clicking the Login button', () => {
    // Find the "Login" button in the header.
    // Using { force: true } because the navbar is fixed/sticky and might be perceived as covered by Cypress
    cy.get('header').contains('Login').click({ force: true });

    // Verify URL changed
    cy.url().should('include', '/login');

    // Verify Login page content is visible
    cy.contains('h1', 'Iniciar Sesión').should('be.visible');
    cy.get('input[name="mail"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('Should navigate to Courses page when clicking Explore Courses', () => {
    // Click the main CTA button in Hero section
    cy.contains('a', 'Explorar Cursos').click();

    // Verify URL changed
    cy.url().should('include', '/courses');

    // Verify Courses page title
    cy.contains('h1', 'Explorar Cursos').should('be.visible');
  });
});
