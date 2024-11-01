const stamp1 = {
  'id': '0244137a-841d-4c8c-b139-691661fe9972',
  'name': 'Apple',
  'description': '가랑비에 옷 젖듯이, 어때요?',
  'url': '/images/test.png',
  'droplet': 5,
  'notForSale': false,
  'type': 'Study',
  'status': 'Friend',
  'userId': '0ede41f7-3128-43ef-98bd-b70c39ceda37',
  'Register': {
    'id': '0ede41f7-3128-43ef-98bd-b70c39ceda37',
    'nickname': 'aaa',
    'email': 'aaa@aaa.aaa',
    'photoUrl': null,
    'locale': 'KR',
    'droplet': 1000,
    'keyValues': [
      'Discipline',
      'Friendship',
      'Leadership',
      'Reliability',
      'Respect',
      'Resourcefulness',
    ],
    'sentence': 'Admin',
  },
  'Tags': [
    {
      'id': '18a50c31-930a-4725-9df6-634601a613ef',
      'name': 'Speak',
    },
  ],
};

const stamp2 = {
  'id': '0244137a-841d-4c8c-b139-691661fe9972',
  'name': 'Apple',
  'url': '/images/test.png',
  'droplet': 5,
  'notForSale': true,
  'type': 'Study',
  'status': 'Friend',
  'userId': 'ac56f045-396e-45a6-87bd-c19058cc46a2',
  'Register': {
    'id': 'ac56f045-396e-45a6-87bd-c19058cc46a2',
    'nickname': 'ddd',
    'email': 'ddd@ddd.ddd',
    'photoUrl': null,
    'locale': 'KR',
    'droplet': 1000,
    'keyValues': [
      'Discipline',
      'Friendship',
      'Leadership',
      'Reliability',
      'Respect',
      'Resourcefulness',
    ],
    'sentence': 'Admin',
  },
  'Tags': [
    {
      'id': '18a50c31-930a-4725-9df6-634601a613ef',
      'name': 'Speak',
    },
  ],
};

describe('Download Page', () => {
  describe('소비자', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
      }, {
        statusCode: 200,
        body: stamp1,
      });
        // 로그인
      cy.intercept({
        method: 'GET',
        url: '**/auth/me',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/auth.json',
      });
      cy.visit('/stamp/download/0244137a-841d-4c8c-b139-691661fe9972');

      cy.get('[data-cy="downloadStamp-stampNameArea"]').as('stampNameArea');
      cy.get('[data-cy="downloadStamp-registerArea"]').as('registerArea');
      cy.get('[data-cy="downloadStamp-dropletArea"]').as('dropletArea');
      cy.get('[data-cy="downloadStamp-descriptionArea"]').as('descriptionArea');
      cy.get('[data-cy="downloadStamp-tagsArea"]').as('tagsArea');
      cy.get('[data-cy="downloadStamp-cancelButton"]').as('cancelButton');
      cy.get('[data-cy="downloadStamp-purchaseButton"]').as('purchaseButton');
    });

    it('초기 화면 표시 확인', () => {
      cy.get('[data-cy="downloadStamp-notForSaleArea"]').should('not.exist');
      cy.get('@stampNameArea').should('contain.text', 'Apple');
      cy.get('@registerArea').should('contain.text', 'aaa');
      cy.get('@dropletArea').should('contain.text', '5');
      cy.get('@descriptionArea').should('contain.text', '가랑비에 옷 젖듯이, 어때요?');
      cy.get('@tagsArea').should('contain.text', 'Speak');
      cy.get('[data-cy="downloadStamp-deleteButton"]').should('not.exist');
      cy.get('[data-cy="downloadStamp-editButton"]').should('not.exist');
      cy.get('@cancelButton').should('be.visible');
      cy.get('@purchaseButton').should('be.visible');
    });

    it('구입 버튼(성공)', () => {
      // 구매 전, 유저 스탬프 목록에 표시 안됨 확인
      cy.get('[data-cy="displayUserStampList"]').should('not.contain.text', 'Apple');
      
      // 구매 리퀘스트 목업
      cy.intercept({
        method: 'POST',
        url: '**/user-stamp',
      }, {
        statusCode: 201,
        fixture: 'integration/stamp/download/success.json',
      });
      // 유저 스탬프 데이터(페이지 이동 대비)
      cy.intercept({
        method: 'GET',
        url: '**/user-stamp/9db9648e-e886-429c-8ea2-e23bb7693e19',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/userStamps/getOne.json',
      });

      cy.get('@purchaseButton').click();
      cy.url().should('include', '/stamp/9db9648e-e886-429c-8ea2-e23bb7693e19');
      
      // 구매 후, 유저 스탬프 목록에 표시됨 확인
      cy.get('[data-cy="displayUserStampList"]').should('contain.text', 'Apple');
    });

    it('구입 버튼(실패)', () => {
      cy.get('[data-cy=commonDialog]').as('commonDialog').should('exist');
      cy.get('@commonDialog').should('have.class', 'hidden');

      cy.intercept({
        method: 'POST',
        url: '**/user-stamp',
      }, {
        statusCode: 422,
        body: {
          message: 'Insufficient droplets for this transaction.',
          error: 'Unprocessable Entity',
          statusCode: 422,
        },
      });
      cy.get('@purchaseButton').click();
      
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain.text', 'Insufficient droplets for this transaction.');
    });

    it('취소 버튼', () => {
      cy.get('@cancelButton').click();
      cy.url().should('include', '/stamp');
    });
  });

  describe('등록자', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
      }, {
        statusCode: 200,
        body: stamp2,
      });
      // 로그인
      cy.intercept({
        method: 'GET',
        url: '**/auth/me',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/auth.json',
      });
      cy.visit('/stamp/download/0244137a-841d-4c8c-b139-691661fe9972');
      
      cy.get('[data-cy="downloadStamp-stampNameArea"]').as('stampNameArea');
      cy.get('[data-cy="downloadStamp-registerArea"]').as('registerArea');
      cy.get('[data-cy="downloadStamp-dropletArea"]').as('dropletArea');
      cy.get('[data-cy="downloadStamp-tagsArea"]').as('tagsArea');
      cy.get('[data-cy="downloadStamp-deleteButton"]').as('deleteButton');
      cy.get('[data-cy="downloadStamp-editButton"]').as('editButton');
      cy.get('[data-cy="downloadStamp-cancelButton"]').as('cancelButton');
      cy.get('[data-cy="downloadStamp-purchaseButton"]').as('purchaseButton');
    });

    it('초기 화면 표시 확인', () => {
      cy.get('[data-cy="downloadStamp-notForSaleArea"]').should('exist');
      cy.get('@stampNameArea').should('contain.text', 'Apple');
      cy.get('@registerArea').should('contain.text', 'ddd');
      cy.get('@dropletArea').should('contain.text', '5');
      cy.get('[data-cy="downloadStamp-descriptionArea"]').should('not.exist');
      cy.get('@tagsArea').should('contain.text', 'Speak');
      cy.get('@deleteButton').should('be.visible');
      cy.get('@editButton').should('be.visible');
    });

    it('수정 버튼', () => {
      cy.get('@editButton').click();
      cy.url().should('include', '/update');
    });

    it('삭제 버튼(성공)', () => {
      cy.intercept({
        method: 'DELETE',
        url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
      }, {
        statusCode: 200,
      });
      cy.get('@deleteButton').click();
      cy.url().should('include', '/stamp');
    });

    it('삭제 버튼(실패)', () => {
      cy.get('[data-cy=commonDialog]').as('commonDialog').should('exist');
      cy.get('@commonDialog').should('have.class', 'hidden');

      cy.intercept({
        method: 'DELETE',
        url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
      }, {
        statusCode: 404,
        fixture: 'integration/stamp/download/delete-error.json',
      });
      cy.get('@deleteButton').click();
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain.text', '시스템 에러가 발생했습니다.');
    });
  });
});
