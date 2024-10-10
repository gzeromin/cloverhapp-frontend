describe('로그인 요청 컴포넌트', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/home');
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);
  });

  it('로그인 요청 메세지 클릭시 로그인 화면으로 이동', () => {
    // 로그인 요청 메세지 표시
    cy.get('[test-id=loginLink').as('loginLink').should('exist');

    // 로그인 요청 메세지 클릭시 로그인 화면으로 이동
    cy.get('@loginLink').click();
    cy.url().should('include', '/login');
  });

});