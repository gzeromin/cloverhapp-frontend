describe('사이드바 컴포넌트', () => {
  beforeEach(() => {
    // 사이드바 컴포넌트 표시 조건
    cy.visit('/');
    cy.viewport(960, 1024);
  });

  it('로그인 안했을 때 로그인 요청 메세지 표시', () => {
    // 로그인 요청 메세지 표시
    cy.get('[test-id="SideBarloginRequest"]').should('exist');
    cy.get('[test-id=loginLink').as('loginLink').should('exist');
    // 사이드바 메뉴 표시 안함
    cy.get('[test-id="SideBarMenu"]').should('not.exist');

    // 로그인 요청 메세지 클릭시 로그인 화면으로 이동
    cy.get('@loginLink').click();
    cy.url().should('include', '/login');
  });

  it('로그인 했을 때, 메뉴 표시', () => {
    // 로그인
    cy.login();
    // 로그인 요청 메세지 표시 안함
    cy.get('[test-id="SideBarloginRequest"]').should('not.exist');
    // 사이드바 메뉴 표시 표시
    cy.get('[test-id="SideBarMenu"]').should('exist');
    cy.get('[test-id="memoButton"]').should('exist');
    cy.get('[test-id="homeButton"]').should('exist');
    cy.get('[test-id="stampButton"]').should('exist');
    cy.get('[test-id="visitorButton"]').should('exist');
    cy.get('[test-id="profileButton"]').should('exist');

    // 초기 메뉴 표시 확인
    cy.get('[test-id="memoComponent"]').should('exist');
    cy.get('[test-id="homeComponent"]').should('not.exist');
    cy.get('[test-id="stampComponent"]').should('not.exist');
    cy.get('[test-id="visitorComponent"]').should('not.exist');
    cy.get('[test-id="profileComponent"]').should('not.exist');
  });

  it('탭 선택 스타일 변화 확인', () => {
    // 로그인
    cy.login();
    // 테스트 대상(프로필 버튼)
    cy.get('[test-id="profileButton"]').as('profileButton');
    // 프로필 버튼 탭 확인
    cy.get('@profileButton').should('have.class', 'bg-gray-50');
    // 프로필 버튼 클릭
    cy.get('@profileButton').click();
    // 프로필 버튼 탭 스타일 변화 확인
    cy.get('@profileButton').should('have.class', 'bg-gray-100');
  });

  it('메뉴 변경 확인', () => {
    // 로그인
    cy.login();
    // 프로필 버튼 클릭
    cy.get('[test-id="profileButton"]').click();
    // 프로필 메뉴 표시 확인
    cy.get('[test-id="memoComponent"]').should('not.exist');
    cy.get('[test-id="homeComponent"]').should('not.exist');
    cy.get('[test-id="stampComponent"]').should('not.exist');
    cy.get('[test-id="visitorComponent"]').should('not.exist');
    cy.get('[test-id="profileComponent"]').should('exist');

    // 스탬프 버튼 클릭
    cy.get('[test-id="stampButton"]').click();
    // 프로필 메뉴 표시 확인
    cy.get('[test-id="memoComponent"]').should('not.exist');
    cy.get('[test-id="homeComponent"]').should('not.exist');
    cy.get('[test-id="stampComponent"]').should('exist');
    cy.get('[test-id="visitorComponent"]').should('not.exist');
    cy.get('[test-id="profileComponent"]').should('not.exist');
  });
});
