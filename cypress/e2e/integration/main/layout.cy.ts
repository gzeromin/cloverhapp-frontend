describe('화면 사이즈 lg[960px] 이상', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/null/profile');
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);
  });

  it('화면 사이즈 lg[960px] 이상', () => {
    // Web 요소가 보여야 함
    cy.get('[id="happCalendarSection"]').should('be.visible');
    cy.get('[id="sideBarSection"]').should('be.visible');

    // Mobile 요소는 보이지 않아야 함
    cy.get('[id="dayLogSection"]').should('not.be.visible');
  });

  it('로그인 안했을 때, 로그인 요청 표시', () => {
    // 로그인 요청 표시
    cy.get('[id="web-loginRequestComp"]').should('exist');
    // 사이드바 링크 표시 안함
    cy.get('[id="SideBarMenu"]').should('not.exist');
  });

  it('로그인 했을 때, 사이드바 링크 표시', () => {
    // 로그인
    cy.login();
    // 로그인 요청 메세지 표시 안함
    cy.get('[id="web-loginRequestComp"]').should('not.exist');
    // 사이드바 링크 표시 표시
    cy.get('[id="SideBarMenu"]').should('exist');
  });
});

describe('화면 사이즈 md[768px] 이상', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/null/profile');
    // md 사이즈 이상 (768px 이상)
    cy.viewport(768, 1024);
  });

  it('화면 사이즈 md[768px] 이상', () => {
    // Web 요소가 보여야 함(사이드바는 보이지 않음)
    cy.get('[id="happCalendarSection"]').should('be.visible');
    cy.get('[id="sideBarSection"]').should('not.be.visible');

    // Mobile 요소는 보이지 않아야 함
    cy.get('[id="dayLogSection"]').should('not.be.visible');
  });

});

describe('메인 페이지, 화면 사이즈 md[768px] 이하', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/main/null/profile');
    // md 사이즈 이하 (768px 이하)
    cy.viewport(574, 800);
  });

  it('화면 사이즈 md[768px] 이하', () => {
    // Web 요소는 보이지 않아야 함
    cy.get('[id="happCalendarSection"]').should('not.be.visible');
    cy.get('[id="sideBarSection"]').should('not.be.visible');
    
    // Mobile 요소가 보여야 함
    cy.get('[id="dayLogSection"]').should('be.visible');
  });

  it('로그인 안했을 때, 로그인 요청 표시', () => {
    // 로그인 요청 표시
    cy.get('[id="mobile-loginRequestComp"]').should('exist');
    // 데이 로그 페이지 표시 안함
    cy.get('[id="dayLogPage"]').should('not.exist');
  });

  it('로그인 했을 때, 사이드바 링크 표시', () => {
    // 로그인
    cy.login();
    // 로그인 요청 메세지 표시 안함
    cy.get('[id="mobile-loginRequestComp"]').should('not.exist');
    // 데이 로그 페이지 표시
    cy.get('[id="dayLogPage"]').should('exist');
  });
});