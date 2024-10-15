
describe('로그인 페이지', () => {
  it('폼 언어 변경 테스트', () => {
    // 로그인 페이지로 이동
    cy.visit('/login');

    //given
    cy.get('[data-cy=emailInput]').as('emailInput').should('exist');
    cy.get('[data-cy=passwordInput]').as('passwordInput').should('exist');
    cy.get('[data-cy=loginButton]').as('loginButton').should('exist');
    cy.get('[data-cy=signupLink]').as('signupLink').should('exist');
    cy.get('[data-cy=localeSelect]').as('localeSelect').should('exist');
    // 처음 표시 언어 확인하기(한국어)
    cy.get('@emailInput').parent().parent().find('label').should('have.text','이메일');
    // 영어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();
    cy.get('@passwordInput').parent().parent().find('label').should('have.text','Password');
    // 일본어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    cy.get('@loginButton').should('have.text','ログイン');
    // 한국어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(0).click();
    cy.get('@signupLink').should('contain','회원가입');
  });

  it('폼 에러 발생, 일본어 버전', () => {
    // 로그인 페이지로 이동
    cy.visit('/login');

    // given
    cy.get('[data-cy=localeSelect]').as('localeSelect');
    cy.get('[data-cy=emailInput]').as('emailInput');
    cy.get('[data-cy=passwordInput]').as('passwordInput');
    cy.get('[data-cy=loginButton]').as('loginButton');
    // 일어로 변경
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(2).click();
    // when
    // email - email 형식을 입력하지 않아서 오류 발생시킴
    cy.get('@emailInput').type('aaa');
    // password - 최소 6글자 입력 규칙 위반
    cy.get('@passwordInput').type('aaa');
    // 로그인 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signin',
    }, {
      statusCode: 400,
      fixture: 'integration/login/form-error.json',
    });
    cy.get('@loginButton').click();
    // then
    cy.get('@emailInput').parent().find('.text-red-500').should('contain', 'Eメールの形式で入力して下さい。');
    cy.get('@passwordInput').parent().find('.text-red-500').should('contain', '最小6文字以上入力して下さい。');
  });

  it('로그인 실패, 한국어 버전', () => {
    // 로그인 페이지로 이동
    cy.visit('/login');

    // given
    cy.get('[data-cy=emailInput]').as('emailInput');
    cy.get('[data-cy=passwordInput]').as('passwordInput');
    cy.get('[data-cy=loginButton]').as('loginButton');
    cy.get('[data-cy=commonDialog]').as('commonDialog').should('exist');
    // when 잘못된 로그인 정보 입력
    cy.get('@emailInput').type('aaa@aaa.aaa');
    cy.get('@passwordInput').type('aaabbb');
    // 로그인 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signin',
    }, {
      statusCode: 401,
      fixture: 'integration/login/login-error.json',
    });
    cy.get('@loginButton').click();
    // then
    cy.get('@commonDialog').should('contain.text', '아이디와 비밀번호를 확인해주세요.');
  });

  it('로그인 성공 후, 페이지 전환, 언어 적용 확인', () => {
    // 로그인 후, 페이지 이동을 확인하기 위해
    cy.visit('/');
    cy.visit('/login');

    // given
    cy.get('[data-cy=emailInput]').as('emailInput');
    cy.get('[data-cy=passwordInput]').as('passwordInput');
    cy.get('[data-cy=loginButton]').as('loginButton');
    cy.get('[data-cy=navBarLogo]').as('navBarLogo').should('exist');
    // when 영어 사용자 로그인 정보 입력
    cy.get('@emailInput').type('aaa@aaa.aaa');
    cy.get('@passwordInput').type('aaaaaa');
    // 로그인 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signin',
    }, {
      statusCode: 201,
      fixture: 'integration/login/success.json',
    });
    cy.intercept({
      method: 'GET',
      url: '**/auth/me',
    }, {
      statusCode: 200,
      fixture: 'integration/login/success.json',
    });
    cy.get('@loginButton').click();
    // then
    cy.url().should('include', '/');
    cy.get('@navBarLogo').should('have.text','CloverHapp');
  });

  it('회원가입 페이지로 이동', () => {
    // 로그인 페이지로 이동
    cy.visit('/login');

    // given
    cy.get('[data-cy=signupLink]').as('signupLink').should('exist');

    // when
    cy.get('@signupLink').click();

    // then
    cy.url().should('include', '/register');
  });
  
});