// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", (EMAIL, PASS) => {
    // email
    cy.get('input[type="text"]').type(EMAIL);
    // password
    cy.get('input[type="password"]').type(PASS);

    // login
    cy.get('button[type="submit"]').click();

    cy.contains("Success").should("exist");
});

Cypress.Commands.add("register", (EMAIL, USERNAME, PASS) => {
    // username
    cy.get('input[placeholder="ProblemSolver2000"]').type(USERNAME);
    // email
    cy.get('input[placeholder="you@example.com"]').type(EMAIL);
    // password
    cy.get('input[type="password"]').type(PASS);

    // register
    cy.get('button[type="submit"]').click();

    cy.contains("Success").should("exist");
});
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
