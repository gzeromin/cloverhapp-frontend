const stamp = {
  'id': '0244137a-841d-4c8c-b139-691661fe9972',
  'name': 'Apple',
  'description': '가랑비에 옷 젖듯이, 어때요?',
  'url': '/images/test.png',
  'droplet': 5,
  'notForSale': false,
  'type': 'Study',
  'status': 'Friend',
  'deleteFlag': false,
  'userId': '89c1d67b-3b97-4558-bfa9-b3836a1a09ef',
  'Register': {
    'id': '89c1d67b-3b97-4558-bfa9-b3836a1a09ef',
    'nickname': 'bbb',
    'email': 'bbb@bbb.bbb',
  },
  'Tags': [
    {
      'id': '18a50c31-930a-4725-9df6-634601a613ef',
      'name': 'Speak',
      'enrolledCount': 2,
    },
  ],
};

describe('Update Page', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '**/auth/me',
    }, {
      statusCode: 200,
      fixture: 'integration/login/success.json',
    });
    cy.intercept({
      method: 'GET',
      url: '**/stamp/0244137a-841d-4c8c-b139-691661fe9972',
    }, {
      statusCode: 200,
      body: stamp,
    });
    cy.visit('/stamp/download/0244137a-841d-4c8c-b139-691661fe9972/update');
    cy.get('[data-cy="stampUpdate-stampNameInput"]').as('stampNameInput');
    cy.get('[data-cy="stampUpdate-notForSaleCheck"]').as('notForSaleCheck');
    cy.get('[data-cy="stampUpdate-dropletInput"]').as('dropletInput');
    cy.get('[data-cy="stampUpdate-typeSelect"]').as('typeSelect');
    cy.get('[data-cy="stampUpdate-statusSelect"]').as('statusSelect');
    cy.get('[data-cy="stampUpdate-descriptionTextarea"]').as('descriptionTextarea');
    cy.get('[data-cy="stampUpdate-addTagsHapp"]').as('addTagsHapp');
    cy.get('[data-cy="stampUpdate-cancelButton"]').as('cancelButton');
    cy.get('[data-cy="stampUpdate-editButton"]').as('editButton');
    cy.get('[data-cy=commonDialog]').as('commonDialog').should('exist');
    cy.get('@commonDialog').should('have.class', 'hidden');
  });

  it('초기 화면 표시 확인', () => {
  });

  it('수정(성공)', () => {
    // Modify the input fields
    cy.get('@stampNameInput').clear().type('Updated Stamp Name');
    cy.get('@descriptionTextarea').clear().type('Updated description');
    cy.get('@dropletInput').clear().type('10');
    cy.get('@statusSelect').click();
    cy.get('@statusSelect').find('li').eq(2).click(); // Public
    cy.get('@notForSaleCheck').check();

    // Add a new tag
    cy.get('@addTagsHapp').type('New Tag{enter}');
  
    cy.intercept({
      method: 'PATCH',
      url: '**/stamp',
    }, {
      statusCode: 200,
      body: {
        ...stamp,
        name: 'Updated Stamp Name',
        description: 'Updated description',
        droplet: 10,
        status: 'Public',
        notForSale: true,
        Tags: [
          {
            id: '18a50c31-930a-4725-9df6-634601a613ef',
            name: 'Speak',
            enrolledCount: 2,
          },
          {
            id: 'new-tag-id',
            name: 'New Tag',
            enrolledCount: 1,
          },
        ],
      },
    });
    cy.get('@editButton').click();
    cy.get('@commonDialog').should('have.class', 'block');
    cy.get('@commonDialog').should('contain.text', 'Stamp was successfully edited.');
    cy.get('[data-cy="commonDialog-ok"]').click();
    cy.url().should('not.include', '/update');
  });

  it('수정(실패-폼에러)', () => {
    // Stamp Name 입력 안함
    cy.get('@stampNameInput').clear();
    // Description 입력(201자)
    cy.fixture('texts/long201.txt').then((data) => {
      cy.get('@descriptionTextarea').type(data);
    });
    cy.intercept({
      method: 'PATCH',
      url: '**/stamp',
    }, {
      statusCode: 400,
      fixture: 'integration/stamp/upload/validation-error.json',
    });
    cy.get('@editButton').click();
      
    cy.get('@stampNameInput').parent().find('.text-red-500').should('contain', '최소 1자 이상 입력 바랍니다.');
    cy.get('@descriptionTextarea').parent().find('.text-red-500').should('contain', '최대 200자 이하 입력 바랍니다.');
  });

  it('수정(실패-시스템에러)', () => {
    cy.intercept({
      method: 'PATCH',
      url: '**/stamp',
    }, {
      statusCode: 500,
      fixture: 'common/system-error.json',
    });
    cy.get('@editButton').click();
      
    cy.get('@commonDialog').should('have.class', 'block');
    cy.get('@commonDialog').should('contain.text', 'A system error has occurred.');
  });

  it('취소 버튼', () => {
    cy.get('@cancelButton').click();
    cy.url().should('not.include', '/update');
  });
});
