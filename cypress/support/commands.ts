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
import 'cypress-file-upload';
import 'cypress-drag-drop';

Cypress.Commands.add('login', (email = 'aaa@aaa.aaa', password = 'aaaaaa') => { 
  // 로그인 페이지로 이동
  cy.visit('/login');

  // 이메일 및 비밀번호 입력 후 로그인 버튼 클릭
  cy.get('[id=login-emailInput]').type(email);
  cy.get('[id=login-passwordInput]').type(password);

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
  
  cy.get('[id=loginButton]').click();

  // 로그인 요청이 성공적으로 처리되었는지 확인
  cy.wait('@loginRequest');
});

// Custom Cypress command to handle uploading a file using react-dropzone
Cypress.Commands.add(
  'upload',
  {
    prevSubject: 'element',
  },
  (subject, fileContent, fileName, mimeType) => {
    cy.window().then(window => {
      // Convert base64 to Blob
      const blob = b64toBlob(fileContent, mimeType);
      
      // Create a new File object
      const testFile = new window.File([blob], fileName, { type: mimeType });

      // Trigger 'drop' event with the created file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);

      cy.wrap(subject).trigger('drop', {
        dataTransfer: dataTransfer,
      });
    });
  }
);

// Helper function to convert base64 string to Blob
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

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