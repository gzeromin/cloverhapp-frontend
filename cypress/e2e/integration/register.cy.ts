describe('회원가입 페이지', () => {

  beforeEach(() => {
    // 회원가입 페이지로 이동
    cy.visit('/register');
  });

  it('로고 언어 변경 테스트', () => {
    //given
    cy.get('[id=registLogo]').as('registLogo').should('exist');
    cy.get('[id=localeSelect]').as('localeSelect').should('exist');
    // 처음 표시 언어 확인하기(한국어)
    cy.get('@registLogo').should('have.text','클로버햅');
    // 영어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();
    cy.get('@registLogo').should('have.text','CloverHapp');
    // 일본어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    cy.get('@registLogo').should('have.text','クローバーハップ');
  });

  it('폼 에러 발생, 한국어 버전', () => {
    // given
    cy.get('[id=register-emailInput]').as('emailInput').should('exist');
    cy.get('[id=register-nicknameInput]').as('nicknameInput').should('exist');
    cy.get('[id=register-passwordInput]').as('passwordInput').should('exist');
    cy.get('[id=register-passwordConfirmInput]').as('passwordConfirmInput').should('exist');
    cy.get('[id=signupButton]').as('signupButton').should('exist');
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
      fixture: 'integration/register/form-error.json',
    });
    cy.get('@signupButton').click();
    // then
    cy.get('@emailInput').parent().find('.text-red-500').should('contain', '이메일 형식이 아닙니다.');
  });

  it('시스템 에러 발생, 영어 버전', () => {
    //given
    cy.get('[id=localeSelect]').as('localeSelect');
    cy.get('[id=register-emailInput]').as('emailInput');
    cy.get('[id=register-nicknameInput]').as('nicknameInput');
    cy.get('[id=register-passwordInput]').as('passwordInput');
    cy.get('[id=register-passwordConfirmInput]').as('passwordConfirmInput');
    cy.get('[id=signupButton]').as('signupButton');
    cy.get('[id=commonDialog]').as('commonDialog').should('exist');
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
      fixture: 'common/system-error.json',
    });
    cy.get('@signupButton').click();
    // then
    cy.get('@commonDialog').should('contain.text', 'A system error has occurred.');
  });

  it('회원가입 성공 후', () => {
    //given
    cy.get('[id=localeSelect]').as('localeSelect');
    cy.get('[id=register-emailInput]').as('emailInput');
    cy.get('[id=register-nicknameInput]').as('nicknameInput');
    cy.get('[id=register-passwordInput]').as('passwordInput');
    cy.get('[id=register-passwordConfirmInput]').as('passwordConfirmInput');
    cy.get('[id=signupButton]').as('signupButton');
    // 일어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    // when
    cy.get('@emailInput').type('bbb@bbb.bbb');
    cy.get('@nicknameInput').type('bbb');
    cy.get('@passwordInput').type('bbbbbb');
    cy.get('@passwordConfirmInput').type('bbbbbb');
    // 회원가입 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signup',
    }, {
      statusCode: 201,
      fixture: 'integration/register/success.json',
    });
    cy.get('@signupButton').click();
  });
  
  it('로그인 페이지로 이동', () => {
    // given
    cy.get('[id=loginLink]').as('loginLink').should('exist');

    // when
    cy.get('@loginLink').click();

    // then
    cy.url().should('include', '/login');
  });
});