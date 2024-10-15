describe('Stamp Page Layout', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/stamp');
  });

  it('로그인 안했을 때', () => {
    // 로그인 요청 표시
    cy.get('[data-cy="stamp-loginRequestComp"]').should('exist');
  });

  it('로그인 했을 때', () => {
    // 로그인
    cy.login();
    // 로그인 요청 표시 안함
    cy.get('[data-cy="stamp-loginRequestComp"]').should('not.exist');
  });
});