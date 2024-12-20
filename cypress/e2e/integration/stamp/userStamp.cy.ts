describe('UserStamp Update Page', () => {
  // it('본인 스탬프가 아닌 경우, 에러 메세지 표시', () => {
  //   // 유저 정보
  //   cy.intercept({
  //     method: 'GET',
  //     url: '**/auth/me',
  //   }, {
  //     statusCode: 200,
  //     fixture: 'integration/login/success.json',
  //   }).as('getAuth');
  //   // 유저 스탬프 데이터
  //   cy.intercept({
  //     method: 'GET',
  //     url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
  //   }, {
  //     statusCode: 500,
  //     body: {
  //       'message': 'Can\'t find UserStamp with id f5a1b27d-339f-463e-92a0-c360f1b02651',
  //       'error': 'Not Found',
  //       'statusCode': 404,
  //     },
  //   }).as('getUserStamp');

  //   // 페이지 방문
  //   cy.visit('stamp/f5a1b27d-339f-463e-92a0-c360f1b02651');
  //   cy.wait('@getAuth');
  //   cy.wait('@getUserStamp');
  //   // 에러메세지 확인
  //   cy.get('[id=commonDialog]').as('commonDialog').should('exist');
  //   cy.get('@commonDialog').should('have.class', 'block');
  //   cy.get('@commonDialog').should('contain.text', 'A system error has occurred.');
  // });

  describe('본인 스탬프인 경우', () => {
    beforeEach(() => {
      // 로그인 사용자 설정
      cy.intercept({
        method: 'GET',
        url: '**/auth/me',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/auth.json',
      }).as('getAuth');
      // 유저 스탬프 데이터
      cy.intercept({
        method: 'GET',
        url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/userStamps/getOne.json',
      });
      // 페이지 방문
      cy.visit('stamp/f5a1b27d-339f-463e-92a0-c360f1b02651');
      cy.wait('@getAuth');
      cy.get('[id=commonDialog]').as('commonDialog').should('exist');
      cy.get('@commonDialog').should('have.class', 'hidden');
    });
  
    it('초기 표시 확인', () => {
      cy.get('[id="userStamp-alias"]').should('have.value', '요가');
      cy.get('[id="userStamp-displayIcon"]').should('exist');
      cy.get('[id="userStamp-invisibleIcon"]').should('not.exist');
      cy.get('[id="userStamp-isDisplayCheckBox"]').should('be.checked');
      cy.get('[id="userStamp-orderNumberInput"]').should('have.value', '1');
      cy.get('[id="userStamp-statusSelect"]').should('contain', '친구공개');
      cy.get('[id="userStamp-cycleCounter"]').should('exist');
      cy.get('[id="userStamp-memoTextarea"]').should('contain', '운동은 시간 나서 하는게 아닌, 시간 내서 하는 것!');
      cy.get('[id="userStamp-addTagsWrapper"]').should('contain.text', '꾸준히');
      cy.get('[id="userStamp-addTagsWrapper"]').should('contain.text', '체력이 국력');
      cy.get('[id="userStamp-addTagsWrapper"]').should('not.contain.text', '홈케어');
    });
  
    it('취소 버튼 확인', () => {
      // 취소 버튼 클릭
      cy.get('[id="userStamp-cancelButton"]').click();
  
      // 변경된 url 확인
      cy.url().should('include', '/stamp');
    });
  
    it('삭제 버튼 확인(실패)', () => {
      // 삭제 요청 목업
      cy.intercept({
        method: 'DELETE',
        url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
      }, {
        statusCode: 404,
        body: {
          'message': 'Can\'t find UserStamp with id f5a1b27d-339f-463e-92a0-c360f1b02651',
          'error': 'Not Found',
          'statusCode': 404,
        },
      });
      // 삭제 버튼 클릭
      cy.get('[id="userStamp-deleteButton"]').click();
  
      // 결과 확인
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain.text', '시스템 에러가 발생했습니다.');
    });
  
    it('삭제 버튼 확인(성공)', () => {
      // 삭제 전, 유저 스탬프 목록에서 표시 확인
      cy.get('[id="displayUserStampList"]').should('contain.text', '요가');
  
      // 삭제 요청 목업
      cy.intercept({
        method: 'DELETE',
        url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/userStamps/delete-success.json',
      });
  
      // 삭제 버튼 클릭
      cy.get('[id="userStamp-deleteButton"]').click();
      // 결과 확인
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain.text', '스탬프가 성공적으로 삭제되었습니다.');
      cy.get('[id="commonDialog-ok"]').click();
      // 변경된 url 확인
      cy.url().should('include', '/stamp');
  
      // 삭제 후, 유저 스탬프 목록에서 사라짐 확인
      cy.get('[id="displayUserStampList"]').should('not.contain.text', '요가');
    });
  
    it('수정 버튼 확인(실패)', () => {
      // 수정 요청 목업
      cy.intercept({
        method: 'POST',
        url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
      }, {
        statusCode: 401,
        body: {
          'message': 'Unauthorized',
          'statusCode': 401,
        },
      });
      // 수정 버튼 클릭
      cy.get('[id="userStamp-saveButton"]').click();
  
      // 결과 확인
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain.text', '로그인 해주세요.');
    });
  
    it('수정 버튼 확인(성공)', () => {
      // 수정 전, 표시 상태 확인
      cy.get('[id="displayUserStampList"]').should('contain.text', '요가');
      cy.get('[id="hiddenUserStampList"]').should('not.contain.text', '요가');

      // 각 필드 내용 변경
      cy.get('[id="userStamp-alias"]').clear().type('아침 요가');
      cy.get('[id="userStamp-isDisplayCheckBox"]').uncheck();
      cy.get('[id="userStamp-orderNumberInput"]').clear().type('99');
      cy.get('[id="userStamp-statusSelect"]').as('statusSelect').click();
      cy.get('@statusSelect').find('li').eq(1).click(); // Private
      cy.get('[id="userStamp-memoTextarea"]').type(' 적어도 두달은 해야 몸에 변화가 생긴다.');
      cy.get('[id="userStamp-addTags"]').type('홈케어{enter}');

      // 목표 설정(일 45분)
      const id = 'userStamp-cycleCounter';
      // goal 활성화
      cy.get(`[id="${id}-existGoalCheck"]`).check();
      cy.get(`[id="${id}-goalInterval-day"]`).click();
      cy.get(`[id="${id}-goalNumberInput"]`).then(($number) => {
        for (let i = 0; i < 3; i++) {
          cy.wrap($number).type('{uparrow}');
        }
      });
      cy.get(`[id="${id}-goalUnitSelect"]`).as('goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          if (keyValue === 'Time') {
            cy.wrap($li).click();
          }
        });
      });

      // 수정 요청 목업
      cy.intercept({
        method: 'POST',
        url: '**/user-stamp/f5a1b27d-339f-463e-92a0-c360f1b02651',
      }, {
        statusCode: 201,
        fixture: 'integration/stamp/userStamps/update-success.json',
      });
      // 수정 버튼 클릭
      cy.get('[id="userStamp-saveButton"]').click();
  
      // 결과 확인
      cy.get('@commonDialog').should('have.class', 'block');
      cy.get('@commonDialog').should('contain', '스탬프가 성공적으로 수정되었습니다.');
      cy.get('[id="commonDialog-ok"]').click();
      
      // 수정 후, 표시 상태 확인
      cy.get('[id="displayUserStampList"]').should('not.contain.text', '요가');
      cy.get('[id="hiddenUserStampList"]').should('contain.text', '아침 요가');
    });
  });
});