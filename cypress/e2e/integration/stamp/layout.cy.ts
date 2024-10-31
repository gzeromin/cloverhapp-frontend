describe('Stamp Page Layout', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/stamp');
  });

  describe('로그인 안했을 때', () => {
    it('유저 섹션 로그인 요청 표시', () => {
      // 로그인 요청 표시
      cy.get('[data-cy="stamp-loginRequestComp"]').should('exist');
    });
    it('스탬프 섹션 목록 표시', () => {
      // 스탬프 데이터를 인터셉트하고 목록 요청을 확인
      cy.intercept({
        method: 'GET',
        url: '**/stamp?page=*',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/list.json',
      });
      // 스탬프 아이템들이 제대로 렌더링되었는지 확인
      cy.get('[data-cy="marketList"]').children().should('have.length', 13);
    });
  });

  describe('로그인 했을 때', () => {
    beforeEach(() => {
      // 로그인
      cy.intercept({
        method: 'GET',
        url: '**/auth/me',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/auth.json',
      });
    });

    it('스탬프 섹션 목록 표시(유저 정보에 의해 필터 됨)', () => {
      // 스탬프 데이터를 인터셉트하고 목록 요청을 확인
      cy.intercept({
        method: 'GET',
        url: '**/stamp?page=*',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/list.json',
      });
      // 스탬프 아이템들이 제대로 렌더링되었는지 확인
      cy.get('[data-cy="marketList"]').children().should('have.length', 5);
    });
    
    it('유저 섹션 로그인 요청 표시 안함', () => {
      // 로그인 요청 표시 안함
      cy.get('[data-cy="stamp-loginRequestComp"]').should('not.exist');
    });

    it('유저 정보 표시', () => {
      cy.get('[data-cy="stamp-userInfo-nickname"]').should('contain.text','ddd');
    });

    it('유저 스탬프 목록 표시', () => {
      // 보이는 스탬프 목록
      cy.get('[data-cy="displayUserStampList"]').children().should('have.length', 5);
      // 감춰진 스탬프 목록
      cy.get('[data-cy="hiddenUserStampList"]').children().should('have.length', 3);
    });

    it('유저 스탬프 클릭시 화면이동(보이는 스탬프 클릭)', () => {
      cy.get('[data-cy="displayUserStampList"]').children().first().click();
      cy.url().should('include', 'stamp/f5a1b27d-339f-463e-92a0-c360f1b02651');
    });

    it('유저 스탬프 클릭시 화면이동(감춰진 스탬프 클릭)', () => {
      // 감춰진 스탬프 목록
      cy.get('[data-cy="hiddenUserStampList"]').children().first().click();
      cy.url().should('include', 'stamp/084c3bde-db20-46ab-9337-9ca39e1d3916');
    });
  });
});