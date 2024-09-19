declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @param email - The user's email
       * @param password - The user's password
       * @example cy.login('aaa@aaa.aaa', 'aaaaa')
       */
      login(email?: string, password?: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}
export {};