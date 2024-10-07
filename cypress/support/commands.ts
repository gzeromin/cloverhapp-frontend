/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email = 'aaa@aaa.aaa', password = 'aaaaaa') => { 
  // 로그인 페이지로 이동
  cy.visit('/login');

  // 이메일 및 비밀번호 입력 후 로그인 버튼 클릭
  cy.get('[test-id=emailInput]').type(email);
  cy.get('[test-id=passwordInput]').type(password);

  cy.intercept({
    method: 'POST',
    url: '**/auth/signin',
  }, {
    statusCode: 201,
    fixture: 'integration/login/success.json',
  }).as('loginRequest');

  cy.intercept({
    method: 'GET',
    url: '**/auth/me',
  }, {
    statusCode: 200,
    fixture: 'integration/login/success.json',
  });
  
  cy.get('[test-id=loginButton]').click();

  // 로그인 요청이 성공적으로 처리되었는지 확인
  cy.wait('@loginRequest');
});
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
//

export {};