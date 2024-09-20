
describe('로그인 페이지', () => {

  beforeEach(() => {
    // 로그인 페이지로 이동
    cy.visit('/login');
  });

  it('폼 언어 변경 테스트', () => {
    //given
    cy.get('[test-id=emailInput]').as('emailInput').should('exist');
    cy.get('[test-id=passwordInput]').as('passwordInput').should('exist');
    cy.get('[test-id=loginButton]').as('loginButton').should('exist');
    cy.get('[test-id=signupLink]').as('signupLink').should('exist');
    cy.get('[test-id=localeSelect]').as('localeSelect').should('exist');
    // 처음 표시 언어 확인하기(한국어)
    cy.get('@emailInput').parent().find('label').should('have.text','이메일');
    // 영어로 변경 확인
    cy.get('@localeSelect').click();
    cy.get('@localeSelect').find('li').eq(1).click();
    cy.get('@passwordInput').parent().find('label').should('have.text','Password');
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
    // given
    cy.get('[test-id=localeSelect]').as('localeSelect');
    cy.get('[test-id=emailInput]').as('emailInput');
    cy.get('[test-id=passwordInput]').as('passwordInput');
    cy.get('[test-id=loginButton]').as('loginButton');
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
    // given
    cy.get('[test-id=emailInput]').as('emailInput');
    cy.get('[test-id=passwordInput]').as('passwordInput');
    cy.get('[test-id=loginButton]').as('loginButton');
    cy.get('[test-id=commonDialog]').as('commonDialog').should('exist');
    // when 잘못된 로그인 정보 입력
    cy.get('@emailInput').type('aaa@aaa.aaa');
    cy.get('@passwordInput').type('aaabbb');
    // 로그인 버튼 클릭
    cy.intercept({
      method: 'POST',
      url: '**/auth/signin',
    }, {
      statusCode: 401,
      fixture: 'integration/login/unauthorized-error.json',
    });
    cy.get('@loginButton').click();
    // then
    cy.get('@commonDialog').should('contain.text', '아이디와 비밀번호를 확인해주세요.');
  });

  it('로그인 성공 후, 페이지 전환, 언어 적용 확인', () => {
    // given
    cy.get('[test-id=emailInput]').as('emailInput');
    cy.get('[test-id=passwordInput]').as('passwordInput');
    cy.get('[test-id=loginButton]').as('loginButton');
    cy.get('[test-id=navBarLogo]').as('navBarLogo').should('exist');
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
    cy.get('@loginButton').click();
    // then
    cy.url().should('include', '/main');
    cy.get('@navBarLogo').should('have.text','CloverHapp');
  });

  it('회원가입 페이지로 이동', () => {
    // given
    cy.get('[test-id=signupLink]').as('signupLink').should('exist');

    // when
    cy.get('@signupLink').click();

    // then
    cy.url().should('include', '/register');
  });
  
});