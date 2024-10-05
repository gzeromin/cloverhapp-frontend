describe('사이드바 링크 컴포넌트', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main');
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);
    // 로그인
    cy.login();
  });

  it('로그인 했을 때, 사이드바 링크 표시', () => {
    cy.get('[test-id="memoLink"]').should('exist');
    cy.get('[test-id="homeLink"]').should('exist');
    cy.get('[test-id="stampLink"]').should('exist');
    cy.get('[test-id="friendLink"]').should('exist');
    cy.get('[test-id="profileLink"]').should('exist');
  });

  it('탭 선택 스타일 변화 확인', () => {
    // 테스트 대상(프로필 버튼)
    cy.get('[test-id="profileLink"]').as('profileLink');
    // 프로필 버튼 탭 확인
    cy.get('@profileLink').should('have.class', 'bg-gray-50');
    // 프로필 버튼 클릭
    cy.get('@profileLink').click();
    // 프로필 버튼 탭 스타일 변화 확인
    cy.get('@profileLink').should('have.class', 'bg-gray-100');
  });

  it('페이지 변경 확인', () => {
    // 프로필 버튼 클릭
    cy.get('[test-id="profileLink"]').click();
    // 프로필 메뉴 표시 확인
    cy.url().should('include', '/profile');

    // 스탬프 버튼 클릭
    cy.get('[test-id="stampLink"]').click();
    // 스탬프 메뉴 표시 확인
    cy.url().should('include', '/stamp');
  });

});