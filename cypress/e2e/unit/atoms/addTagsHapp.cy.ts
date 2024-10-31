describe('Upload Page', () => {
  const tagName = 'test Tag';

  beforeEach(() => {
    cy.visit('/stamp/upload'); // 업로드 페이지로 이동
    cy.get('[data-cy="addTagsHapp"]').as('addTagsHapp').should('be.visible');
    cy.get('[data-cy=localeSelect]').as('localeSelect').should('exist');
    cy.get('[data-cy="tagContainer"]').as('tagContainer').should('exist');
    cy.get('[data-cy="commonDialog"]').as('commonDialog');
  });

  it('태그 추가하고 삭제', () => {
    // 태그 추가 (AddTagsHapp)
    cy.get('@addTagsHapp').type(`${tagName}{enter}`);

    // test Tag가 추가되었는지 확인
    cy.get('@tagContainer') // 태그가 담기는 컨테이너 확인
      .find('[data-cy="tag-0"]').as('addedTag') // 첫 번째로 추가된 태그 확인
      .should('contain.text', tagName); // tagName이 포함되어 있는지 확인

    // 태그 삭제 테스트
    cy.get('@addedTag').click();

    // 삭제 후 tagContainer에 tag-0가 존재하지 않는지 확인
    cy.get('@tagContainer')
      .find('[data-cy="tag-0"]')
      .should('not.exist');
  });

  it('태그 추가시 스크롤 이동 확인', () => {
    for (let i = 0; i < 8; i++) {
      const tagName = `Lorem ipsum dolor sit amet, c${i + 1}`;
      // 태그 추가 (AddTagsHapp)
      cy.get('@addTagsHapp').type(`${tagName}{enter}`);
    }

    // test Tag가 추가되었는지 확인
    cy.get('@tagContainer').find('[data-cy="tag-7"]').as('newTag');

    // 스크롤이 태그 추가로 인해 이동했는지 확인 (visibility check)
    cy.get('@newTag').then(($el) => {
      const tagContainer = $el[0].parentElement;
      // 태그 컨테이너의 현재 스크롤 높이를 확인하여 스크롤이 일어났는지 검증
      cy.wrap(tagContainer).scrollTo('bottom');
      cy.wrap($el).should('be.visible'); // 새로 추가된 태그가 보이는지 확인
    });
  });

  it('태그 10개 이상 추가할시 경고메세지 출력(한국어)', () => {
    for (let i = 0; i < 11; i++) {
      const tagName = `Tag ${i + 1}`;
      // 태그 추가 (AddTagsHapp)
      cy.get('@addTagsHapp').type(`${tagName}{enter}`);
    }
    // 에러 메시지가 표시되는지 확인
    cy.get('@commonDialog').should('have.class', 'block');
    cy.get('@commonDialog').should('contain', '최대 10개까지 추가할 수 있습니다.');
  });

  it('중복된 태그 추가시 경고 메세지 출력(일본어)', () => {
    // 일본어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();

    cy.get('@addTagsHapp').type(`${tagName}{enter}`);
    cy.get('@addTagsHapp').type(`${tagName}{enter}`);

    // 에러 메시지가 표시되는지 확인
    cy.get('@commonDialog').should('have.class', 'block');
    cy.get('@commonDialog').should('contain', `${tagName}はすでに追加されたタグです。`);
  });

  it('태그 30자 이상 넘어갈시 경고메세지 출력(영어)', () => {
    // 영어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();

    const text30 = 'Lorem ipsum dolor sit amet, co';
    // 30자 까지는 문제 없음
    cy.get('@addTagsHapp').type(`${text30}{enter}`);
    cy.get('@commonDialog').should('have.class', 'hidden');
    const text31 = text30 + 'n';
    cy.get('@addTagsHapp').type(`${text31}{enter}`);
    // 에러 메시지가 표시되는지 확인
    cy.get('@commonDialog').should('have.class', 'block');
    cy.get('@commonDialog').should('contain', 'Tag must be shorter than or equal to 30 characters.');
  });
});
