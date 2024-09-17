
describe('회원가입 페이지', () => {

  beforeEach(() => {
    // 회원가입 페이지로 이동
    cy.visit('/register');
  });

  it('로고 언어 변경 테스트', () => {
    //given
    cy.get('[test-id=registLogo]').as('registLogo').should('exist');
    cy.get('[test-id=localeSelect]').as('localeSelect').should('exist');
    // 처음 표시 언어 확인하기(한국어)
    cy.get('@registLogo').should('have.text','세잎 클로버');
    // 영어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();
    cy.get('@registLogo').should('have.text','Three Clover');
    // 일본어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    cy.get('@registLogo').should('have.text','三葉クローバー');
  });

  it('폼 에러 발생, 한국어 버전', () => {
    // given
    cy.get('[test-id=emailInput]').as('emailInput').should('exist');
    cy.get('[test-id=nicknameInput]').as('nicknameInput').should('exist');
    cy.get('[test-id=passwordInput]').as('passwordInput').should('exist');
    cy.get('[test-id=passwordConfirmInput]').as('passwordConfirmInput').should('exist');
    cy.get('[test-id=signupButton]').as('signupButton').should('exist');
    // when
    // email - email 형식을 입력하지 않아서 오류 발생시킴
    cy.get('@emailInput').type('aa');
    // nickname - 이미 등록된 회원의 닉네임 입력
    cy.get('@nicknameInput').type('aaa');
    // password - 최소 6글자 입력 규칙 위반
    cy.get('@passwordInput').type('aaaa');
    // passwordConfirm - password와 일치하지 않음
    cy.get('@passwordConfirmInput').type('aaaaa');
    // 회원가입 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signup',
    }, {
      statusCode: 400,
      fixture: 'register/form-error.json',
    });
    cy.get('@signupButton').click();
    // then
    cy.get('@emailInput').parent().find('.text-red-500').should('contain', '이메일 형식이 아닙니다.');
  });

  it('시스템 에러 발생, 영어 버전', () => {
    //given
    cy.get('[test-id=localeSelect]').as('localeSelect');
    cy.get('[test-id=emailInput]').as('emailInput');
    cy.get('[test-id=nicknameInput]').as('nicknameInput');
    cy.get('[test-id=passwordInput]').as('passwordInput');
    cy.get('[test-id=passwordConfirmInput]').as('passwordConfirmInput');
    cy.get('[test-id=signupButton]').as('signupButton');
    cy.get('[test-id=commonDialog]').as('commonDialog').should('exist');
    // 영어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();
    // when
    cy.get('@emailInput').type('aaa@aaa.aaa');
    cy.get('@nicknameInput').type('aaa');
    cy.get('@passwordInput').type('aaaaaa');
    cy.get('@passwordConfirmInput').type('aaaaaa');
    // 회원가입 버튼 클릭, 서버 상에서 에러 발생
    cy.intercept({
      method: 'POST',
      url: '**/auth/signup',
    }, {
      statusCode: 500,
      fixture: 'register/system-error.json',
    });
    cy.get('@signupButton').click();
    // then
    cy.get('@commonDialog').should('contain.text', 'A system error has occurred.');
  });

  it('회원가입 성공 후, 페이지 전환, 일본어 버전', () => {
    //given
    cy.get('[test-id=localeSelect]').as('localeSelect');
    cy.get('[test-id=emailInput]').as('emailInput');
    cy.get('[test-id=nicknameInput]').as('nicknameInput');
    cy.get('[test-id=passwordInput]').as('passwordInput');
    cy.get('[test-id=passwordConfirmInput]').as('passwordConfirmInput');
    cy.get('[test-id=signupButton]').as('signupButton');
    // 일어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    // when
    cy.get('@emailInput').type('kkk@kkk.kkk');
    cy.get('@nicknameInput').type('kkk');
    cy.get('@passwordInput').type('kkkkkk');
    cy.get('@passwordConfirmInput').type('kkkkkk');
    // 회원가입 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signup',
    }, {
      statusCode: 201,
      fixture: 'register/success.json',
    });
    cy.get('@signupButton').click();
    // then
    cy.url().should('include', '/');
  });
  
});