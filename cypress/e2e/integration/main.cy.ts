describe('메인 페이지', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/');
  });

  it('화면 사이즈 lg[960px] 이상', () => {
    // lg 사이즈 이상 (960px 이상)
    cy.viewport(960, 1024);

    // Web 요소가 보여야 함
    cy.get('[test-id="happCalendarComponent"]').should('be.visible');
    cy.get('[test-id="sideBarComponent"]').should('be.visible');

    // Mobile 요소는 보이지 않아야 함
    cy.get('[test-id="dayLogComponent"]').should('not.be.visible');
  });

  it('화면 사이즈 md[768px] 이상', () => {
    // md 사이즈 이상 (768px 이상)
    cy.viewport(768, 1024);

    // Web 요소가 보여야 함(사이드바는 보이지 않음)
    cy.get('[test-id="happCalendarComponent"]').should('be.visible');
    cy.get('[test-id="sideBarComponent"]').should('not.be.visible');

    // Mobile 요소는 보이지 않아야 함
    cy.get('[test-id="dayLogComponent"]').should('not.be.visible');
  });

  it('화면 사이즈 md[768px] 이하', () => {
    // md 사이즈 이하 (768px 이하)
    cy.viewport(574, 800);
    
    // Web 요소는 보이지 않아야 함
    cy.get('[test-id="happCalendarComponent"]').should('not.be.visible');
    cy.get('[test-id="sideBarComponent"]').should('not.be.visible');
    
    // Mobile 요소가 보여야 함
    cy.get('[test-id="dayLogComponent"]').should('be.visible');
  });
});