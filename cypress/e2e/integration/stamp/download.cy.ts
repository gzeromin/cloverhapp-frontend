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
  'userId': '89c1d67b-3b97-4558-bfa9-b3836a1a09ef',
  'Register': {
    'id': '89c1d67b-3b97-4558-bfa9-b3836a1a09ef',
    'nickname': 'bbb',
    'email': 'bbb@bbb.bbb',
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
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '**/auth/me',
    }, {
      statusCode: 200,
      fixture: 'integration/login/success.json',
    });
    cy.visit('/stamp/download/0244137a-841d-4c8c-b139-691661fe9972');
  });

  describe('소비자', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
      }, {
        statusCode: 200,
        body: stamp1,
      });
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
      cy.intercept({
        method: 'POST',
        url: '**/user-stamp',
      }, {
        statusCode: 201,
        fixture: 'integration/stamp/download/success.json',
      });
      cy.get('@purchaseButton').click();
      cy.url().should('not.include', '/stamp/download');
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
      cy.url().should('not.include', '/stamp/download');
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
      cy.get('@registerArea').should('contain.text', 'bbb');
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
      cy.url().should('not.include', '/stamp/download');
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
      cy.get('@commonDialog').should('contain.text', 'A system error has occurred.');
    });
  });
});
