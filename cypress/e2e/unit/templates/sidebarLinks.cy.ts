describe('사이드바 링크 컴포넌트', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/null/profile');
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);
    // 로그인
    cy.login();
  });

  it('로그인 했을 때, 사이드바 링크 표시', () => {
    cy.get('[id="profileLink"]').as('profileLink').should('exist');
    cy.get('[id="goalLink"]').as('goalLink').should('exist');
    cy.get('[id="friendLink"]').as('friendLink').should('exist');
    cy.get('[id="statisticsLink"]').as('statisticsLink').should('exist');

    // 초기 선택된 탭 CSS 확인
    cy.get('@profileLink').should('have.class', 'bg-gray-100');
    cy.get('@goalLink').should('have.class', 'bg-gray-50');
    cy.get('@friendLink').should('have.class', 'bg-gray-50');
    cy.get('@statisticsLink').should('have.class', 'bg-gray-50');
  });

  it('페이지 변경 확인', () => {
    // GIVEN
    // 테스트 대상(스탬프 링크)
    cy.get('[id="goalLink"]').as('goalLink');
    
    // WHEN
    // 스탬프 링크 클릭
    cy.get('@goalLink').click({ force: true });
    
    // THEN
    // 변경 후 선택된 탭 CSS 확인
    cy.url().should('include', '/goal');
    cy.get('[id="profileLink"]').should('have.class', 'bg-gray-50');
    cy.get('@goalLink').should('have.class', 'bg-gray-100');
    cy.get('[id="friendLink"]').should('have.class', 'bg-gray-50');
    cy.get('[id="statisticsLink"]').should('have.class', 'bg-gray-50');
  });

});