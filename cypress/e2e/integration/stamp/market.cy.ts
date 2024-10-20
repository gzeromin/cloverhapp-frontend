describe('Market Page', () => {
  beforeEach(() => {
    // 페이지 방문
    cy.visit('/stamp');
    cy.get('[data-cy="marketList"]').as('marketList');
  });

  it('스탬프 목록 표시', () => {
    // 스탬프 데이터를 인터셉트하고 목록 요청을 확인
    cy.intercept({
      method: 'GET',
      url: '**/stamp?page=1',
    }, {
      statusCode: 200,
      fixture: 'integration/stamp/list.json',
    }).as('listRequest');

    // 스탬프 아이템들이 제대로 렌더링되었는지 확인
    cy.get('@marketList').children().should('have.length', 13);
  });

  it('필터되지 않은 스탬프만 표시', () => {
    // 로그인
    cy.login();

    cy.intercept({
      method: 'GET',
      url: '**/stamp?page=1',
    }, {
      statusCode: 200,
      fixture: 'integration/stamp/list.json',
    }).as('listRequest');

    // 스탬프 아이템들이 제대로 렌더링되었는지 확인
    cy.get('@marketList').children().should('have.length', 5);
  });

  // TODO: 데이터 추가 후 작성
  // it('무한 스크롤 동작 테스트', () => {
  //   // 첫 번째 페이지 요청 인터셉트
  //   cy.intercept({
  //     method: 'GET',
  //     url: '**/stamp?page=1',
  //   }, {
  //     statusCode: 200,
  //     fixture: 'integration/stamp/list.json',
  //   }).as('listRequestPage1');

  //   // 두 번째 페이지 요청 인터셉트
  //   cy.intercept({
  //     method: 'GET',
  //     url: '**/stamp?page=2',
  //   }, {
  //     statusCode: 200,
  //     fixture: 'integration/stamp/list.json',
  //   }).as('listRequestPage2');

  //   cy.get('@marketList').children().should('have.length', 13);

  //   // 스크롤을 마지막 아이템까지 내려서 두 번째 페이지 로드 트리거
  //   cy.get('[data-cy="market-list"]').scrollTo('bottom');

  //   // 스탬프 아이템들이 제대로 렌더링되었는지 확인
  //   cy.get('@marketList').children().should('have.length', 26);
  // });

  it('스탬프 선택 후 다운로드 페이지로 이동(로그인 된 경우)', () => {
    // 로그인
    cy.login();
    cy.intercept({
      method: 'GET',
      url: '**/stamp?page=1',
    }, {
      statusCode: 200,
      fixture: 'integration/stamp/list.json',
    }).as('listRequest');

    // 스탬프 선택
    cy.get('@marketList').children().first().click();

    // 다운로드 페이지로 이동 확인
    cy.url().should('include', 'download');
  });

  it('스탬프 선택 후 다운로드 페이지로 이동 안됨(로그인 안된 경우)', () => {
    cy.intercept({
      method: 'GET',
      url: '**/stamp?page=1',
    }, {
      statusCode: 200,
      fixture: 'integration/stamp/list.json',
    }).as('listRequest');

    // 스탬프 선택
    cy.get('@marketList').children().eq(11).click();

    // 에러메세지 확인
    cy.get('[data-cy=commonDialog]').should('contain.text', '로그인 해주세요.');
  });
});
