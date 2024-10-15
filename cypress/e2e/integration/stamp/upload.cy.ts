describe('Upload Page', () => {
  beforeEach(() => {
    cy.visit('/stamp/upload'); // 업로드 페이지로 이동

    cy.get('[data-cy="dropZone"]').as('dropZone');
    cy.get('[data-cy="stampNameInput"]').as('stampNameInput');
    cy.get('[data-cy="notForSaleCheck"]').as('notForSaleCheck');
    cy.get('[data-cy="dropletInput"]').as('dropletInput');
    cy.get('[data-cy="typeSelect"]').as('typeSelect');
    cy.get('[data-cy="statusSelect"]').as('statusSelect');
    cy.get('[data-cy="descriptionTextarea"]').as('descriptionTextarea');
    cy.get('[data-cy="addTagsHapp"]').as('addTagsHapp');
    cy.get('[data-cy="uploadButton"]').as('uploadButton');
  });

  it('초기 화면 표시 확인', () => {
    cy.get('@dropZone').should('be.visible');
    cy.get('@dropZone').find('img[alt="Uploaded"]').should('not.exist');
    cy.get('@dropZone').find('p').should('exist');
    cy.get('@stampNameInput').should('be.visible');
    cy.get('@notForSaleCheck').should('be.visible');
    cy.get('@dropletInput').should('be.visible');
    cy.get('@typeSelect').should('be.visible');
    cy.get('@statusSelect').should('be.visible');
    cy.get('@descriptionTextarea').should('be.visible');
    cy.get('@addTagsHapp').should('be.visible');
    cy.get('@uploadButton').should('exist');
  });

  it('스탬프 등록 성공', () => {
    // Stamp Name 입력
    cy.get('@stampNameInput').type('테스트');
    // Not for sale 체크박스 확인 및 체크
    cy.get('@notForSaleCheck').check().should('be.checked');
    // Droplet 필드에 값 입력 (Not for Sale 체크박스가 체크되어 있으면 비활성화되어야 함)
    cy.get('@dropletInput').should('be.disabled');
    // Stamp Type 선택
    cy.get('@typeSelect').click();
    cy.get('@typeSelect').find('li').eq(2).click(); // 행복 타입
    // Stamp Status 선택
    cy.get('@statusSelect').click();
    cy.get('@statusSelect').find('li').eq(1).click(); // 친구 공개 상태
    // Description 입력
    cy.get('@descriptionTextarea').type('This is a test description.');
    // 태그 추가 (AddTagsHapp)
    cy.get('@addTagsHapp').type('test Tag{enter}'); // 태그 입력 및 추가
    // 이미지 드래그 앤 드롭
    const fileName = 'images/test.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      const mimeType = 'image/png'; // 파일의 MIME 타입
      cy.get('@dropZone').upload(fileContent, fileName, mimeType);
      cy.get('@dropZone').find('img[alt="Uploaded"]').should('exist');
    cy.get('@dropZone').find('p').should('not.exist');
    });

    // 성공 응답
    cy.intercept({
      method: 'POST',
      url: '**/stamp',
    }, {
      statusCode: 201,
      fixture: 'integration/stamp/upload/success.json',
    }).as('uploadRequest');

    // 업로드 버튼 클릭
    cy.get('@uploadButton').click();

    // 성공 다이얼로그가 나타나는지 확인
    cy.get('[data-cy="commonDialog"]').should('have.class', 'block');
    cy.get('[data-cy="commonDialog-ok"]').click();
    cy.get('[data-cy="commonDialog"]').should('have.class', 'hidden');

    // 검증: 필드 초기화 여부
    cy.get('@stampNameInput').should('have.value', ''); // 이름 필드가 빈 값으로 초기화되는지 확인
    cy.get('@descriptionTextarea').should('have.value', ''); // 설명 필드가 빈 값으로 초기화되는지 확인
    cy.get('@dropletInput').should('have.value', '0'); // droplet 필드가 빈 값으로 초기화되는지 확인
    cy.get('@addTagsHapp').should('have.value', ''); // 태그 필드 초기화 여부 확인
    cy.get('@notForSaleCheck').should('not.be.checked'); // 체크박스 초기화 여부 확인
    cy.get('@dropZone').find('img[alt="Uploaded"]').should('not.exist');
    cy.get('@dropZone').find('p').should('exist');// 업로드된 이미지 초기화 여부 확인 (이미지 업로드가 있었다면)
  });

  it('이미지가 없는 경우 경고 메세지 출력', () => {
    // 이미지를 등록하지 않은 상태에서 업로드 버튼 클릭
    cy.get('@uploadButton').click();

    // 에러 메시지가 표시되는지 확인
    cy.get('[data-cy="commonDialog"]').should('have.class', 'block');
    cy.get('[data-cy="commonDialog"]').should('contain', '이미지 파일을 업로드해주세요.');
  });

  it('폼에러 출력 확인', () => {
    // Stamp Name 입력 안함
    // Not for sale 체크박스 확인 및 체크
    cy.get('@notForSaleCheck').check().should('be.checked');
    // Droplet 필드에 값 입력 (Not for Sale 체크박스가 체크되어 있으면 비활성화되어야 함)
    cy.get('@dropletInput').should('be.disabled');
    // Stamp Type 선택
    cy.get('@typeSelect').click();
    cy.get('@typeSelect').find('li').eq(2).click(); // 행복 타입
    // Stamp Status 선택
    cy.get('@statusSelect').click();
    cy.get('@statusSelect').find('li').eq(1).click(); // 친구 공개 상태
    // Description 입력(201자)
    cy.fixture('texts/long201.txt').then((data) => {
      cy.get('@descriptionTextarea').type(data);
    });
    // 태그 추가 안함
    // 이미지 드래그 앤 드롭
    const fileName = 'images/test.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      const mimeType = 'image/png'; // 파일의 MIME 타입
      cy.get('@dropZone').upload(fileContent, fileName, mimeType);
      cy.get('@dropZone').find('img[alt="Uploaded"]').should('exist');
      cy.get('@dropZone').find('p').should('not.exist');
    });

    // 에러 발생 응답
    cy.intercept({
      method: 'POST',
      url: '**/stamp',
    }, {
      statusCode: 400,
      fixture: 'integration/stamp/upload/validation-error.json',
    });

    // 업로드 버튼 클릭
    cy.get('@uploadButton').click();

    // 에러 메시지가 표시되는지 확인
    cy.get('@stampNameInput').parent().find('.text-red-500').should('contain', '최소 1자 이상 입력 바랍니다.');
    cy.get('@descriptionTextarea').parent().find('.text-red-500').should('contain', '최대 200자 이하 입력 바랍니다.');
  });
});
