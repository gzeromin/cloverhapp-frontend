const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
)?.set;
describe('Cycle Counter Component', () => {
  const dataCy = 'userStamp-cycleCounter';
  const stampId = 'f5a1b27d-339f-463e-92a0-c360f1b02651';
  describe('각 필드 공통 확인', () => {
    beforeEach(() => {
      // 로그인
      cy.intercept({
        method: 'GET',
        url: '**/auth/me',
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/auth.json',
      });
      // 유저 스탬프 데이터
      cy.intercept({
        method: 'GET',
        url: `**/user-stamp/${stampId}`,
      }, {
        statusCode: 200,
        fixture: 'integration/stamp/userStamps/getOne.json',
      });
      // 페이지 방문
      cy.visit(`stamp/${stampId}`);
      // Given
      cy.get(`[data-cy="${dataCy}-existGoalCheck"]`).as('existGoalCheck');
    });
    
    it('컴포넌트 존재 확인', () => {
      cy.get(`[data-cy="${dataCy}"]`).should('exist');
    });
  
    it('목표설정 체크 활성화 확인', () => {
      // Given
      cy.get(`[data-cy="${dataCy}-goalInterval"]`).as('goalInterval');
      cy.get(`[data-cy="${dataCy}-goalNumberInput"]`).as('goalNumberInput');
      cy.get(`[data-cy="${dataCy}-goalUnitSelect"]`).as('goalUnitSelect');
  
      // 체크 활성화
      cy.get('@existGoalCheck').check();
      cy.get('@existGoalCheck').should('be.checked');
      
      // 스타일 변화 확인
      cy.get('@goalInterval').should('have.class', 'cursor-pointer');
      cy.get('@goalNumberInput').should('not.be.disabled');
      cy.get('@goalUnitSelect').should('have.class', 'cursor-pointer');
      
      // 체크 비활성화
      cy.get('@existGoalCheck').uncheck();
      cy.get('@existGoalCheck').should('not.be.checked');
    
      // 스타일 변화 확인
      cy.get('@goalInterval').should('have.class', 'cursor-not-allowed');
      cy.get('@goalNumberInput').should('be.disabled');
      cy.get('@goalUnitSelect').should('have.class', 'cursor-not-allowed');
    });
  
    it('목표 간격 선택에 따른 스타일 변화 확인', () => {
      // goal 활성화
      cy.get('@existGoalCheck').check();
  
      // Given
      cy.get(`[data-cy="${dataCy}-goalInterval-month"]`).as('month');
      cy.get(`[data-cy="${dataCy}-goalInterval-week"]`).as('week');
      cy.get(`[data-cy="${dataCy}-goalInterval-day"]`).as('day');
  
      // 초기 확인
      cy.get('@month').children().should('have.class', 'bg-gray-50');
      cy.get('@week').children().should('have.class', 'bg-green-100');
      cy.get('@day').children().should('have.class', 'bg-gray-50');
  
      // month 클릭
      cy.get('@month').click();
      // 변화 확인
      cy.get('@month').children().should('have.class', 'bg-green-100');
      cy.get('@week').children().should('have.class', 'bg-gray-50');
      cy.get('@day').children().should('have.class', 'bg-gray-50');
      
      // week 클릭
      cy.get('@week').click();
      // 변화 확인
      cy.get('@month').children().should('have.class', 'bg-gray-50');
      cy.get('@week').children().should('have.class', 'bg-green-100');
      cy.get('@day').children().should('have.class', 'bg-gray-50');
  
      // day 클릭
      cy.get('@day').click();
      // 변화 확인
      cy.get('@month').children().should('have.class', 'bg-gray-50');
      cy.get('@week').children().should('have.class', 'bg-gray-50');
      cy.get('@day').children().should('have.class', 'bg-green-100');
    });
  });

  describe('스탬프 타입에 대한 input과 select 변화 확인', () => {
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

    it('StampType.WAKE_UP(,GO_TO_BED)/ Hour', () => {
      // 유저 스탬프 데이터
      cy.fixture('integration/stamp/userStamps/getOne.json').then((fixtureData) => {
        // Stamp.type 값을 변경
        fixtureData.Stamp.type = 'WakeUp';
        // intercept 설정
        cy.intercept({
          method: 'GET',
          url: `**/user-stamp/${stampId}`,
        }, {
          statusCode: 200,
          body: fixtureData,
        });
      });

      // 페이지 방문
      cy.visit(`stamp/${stampId}`);

      // goal 활성화
      cy.get(`[data-cy="${dataCy}-existGoalCheck"]`).check();

      // Given
      cy.get(`[data-cy="${dataCy}-goalNumberInput"]`).as('goalNumberInput');
      cy.get(`[data-cy="${dataCy}-goalUnitSelect"]`).as('goalUnitSelect');

      cy.get('@goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          expect(keyValue).to.be.oneOf(['Hour']);
          expect(keyValue).not.to.be.oneOf(['Number','Milliliter','Time','Book','Dollar','Yen','Won']);
        });
      });
      cy.get('@goalUnitSelect').click();
    
      
      cy.get('@goalNumberInput').invoke('attr', 'type').should('equal', 'time');
      cy.get('@goalNumberInput').invoke('attr', 'step').should('equal', '900');

      cy.get('@goalNumberInput').clear().type('18:30');
      cy.get('@goalNumberInput').should('have.value', '18:30');
    });

    it('StampType.BOOK/ Book, Time', () => {
      // 유저 스탬프 데이터
      cy.fixture('integration/stamp/userStamps/getOne.json').then((fixtureData) => {
        // Stamp.type 값을 변경
        fixtureData.Stamp.type = 'Book';
        // intercept 설정
        cy.intercept({
          method: 'GET',
          url: `**/user-stamp/${stampId}`,
        }, {
          statusCode: 200,
          body: fixtureData,
        });
      });
      
      // 페이지 방문
      cy.visit(`stamp/${stampId}`);

      // goal 활성화
      cy.get(`[data-cy="${dataCy}-existGoalCheck"]`).check();

      // Given
      cy.get(`[data-cy="${dataCy}-goalNumberInput"]`).as('goalNumberInput');
      cy.get(`[data-cy="${dataCy}-goalUnitSelect"]`).as('goalUnitSelect');
      
      cy.get('@goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          expect(keyValue).to.be.oneOf(['Time','Book']);
          expect(keyValue).not.to.be.oneOf(['Number','Milliliter','Hour','Dollar','Yen','Won']);
        });
      });
      cy.get('@goalUnitSelect').click();
    
      cy.get('@goalNumberInput').invoke('attr', 'type').should('equal', 'number');
      cy.get('@goalNumberInput').invoke('attr', 'step').should('equal', '1');
      
      cy.get('@goalNumberInput').clear().type('3');
      cy.get('@goalNumberInput').should('have.value', '3');

      cy.get('@goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          if (keyValue === 'Time') {
            cy.wrap($li).click();
          }
        });
      });

      cy.get('@goalNumberInput').invoke('attr', 'type').should('equal', 'range');
      cy.get('@goalNumberInput').invoke('attr', 'step').should('equal', '1');

      cy.get(`[data-cy="${dataCy}-goalNumberTime"]`).as('goalNumberTime').should('exist');
      cy.get('@goalNumberInput').should('have.value', '3');
      cy.get('@goalNumberTime').should('contain.text', '45');
      
      cy.get('@goalNumberInput').then(($range) => {
        const range = $range[0];
        nativeInputValueSetter?.call(range, 4);
        range.dispatchEvent(new Event('change', { bubbles: true }));
      });

      cy.get('@goalNumberTime').should('contain.text', '1');
      
      cy.get('@goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          if (keyValue === 'Book') {
            cy.wrap($li).click();
          }
        });
      });
      
      cy.get('@goalNumberTime').should('not.exist');
      cy.get('@goalNumberInput').should('have.value', '4');
    });

    it('StampType.WATER/ Milliliter', () => {
      // 유저 스탬프 데이터
      cy.fixture('integration/stamp/userStamps/getOne.json').then((fixtureData) => {
        // Stamp.type 값을 변경
        fixtureData.Stamp.type = 'Water';
        // intercept 설정
        cy.intercept({
          method: 'GET',
          url: `**/user-stamp/${stampId}`,
        }, {
          statusCode: 200,
          body: fixtureData,
        });
      });

      // 페이지 방문
      cy.visit(`stamp/${stampId}`);

      // goal 활성화
      cy.get(`[data-cy="${dataCy}-existGoalCheck"]`).check();

      // Given
      cy.get(`[data-cy="${dataCy}-goalNumberInput"]`).as('goalNumberInput');
      cy.get(`[data-cy="${dataCy}-goalUnitSelect"]`).as('goalUnitSelect');

      cy.get('@goalUnitSelect').click();
      cy.get('@goalUnitSelect').find('li').each(($li) => {
        cy.wrap($li).invoke('attr', 'data-key').then((keyValue) => {
          expect(keyValue).to.be.oneOf(['Milliliter']);
          expect(keyValue).not.to.be.oneOf(['Number','Hour','Time','Book','Dollar','Yen','Won']);
        });
      });
      cy.get('@goalUnitSelect').click();
      
      cy.get('@goalNumberInput').invoke('attr', 'type').should('equal', 'number');
      cy.get('@goalNumberInput').invoke('attr', 'step').should('equal', '500');

      cy.get('@goalNumberInput').then(($number) => {
        for (let i = 0; i < 3; i++) {
          cy.wrap($number).type('{uparrow}'); // 위 화살표 키를 세 번 누름
        }
      });

      cy.get('@goalNumberInput').should('have.value', '1500');
    });
  });
});