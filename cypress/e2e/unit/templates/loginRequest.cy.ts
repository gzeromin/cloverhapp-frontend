describe('로그인 요청 컴포넌트', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/null/profile');
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);
  });

  it('로그인 요청 메세지 클릭시 로그인 화면으로 이동', () => {
    // 로그인 요청 메세지 표시
    cy.get('[id=web-loginRequestComp]').as('loginRequestComp').should('exist');

    // 컴포넌트 안의 링크 클릭
    cy.get('@loginRequestComp').find('a').click();

    // 로그인 요청 메세지 클릭시 로그인 화면으로 이동
    cy.url().should('include', '/login');
  });
});