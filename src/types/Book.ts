export interface Book {
  id: string;
  // 도서 제목
  title: string;
  // 도서 소개
  contents:	string;
  // 도서 상세 URL
  url: string;
  /**
   * ISBN10(10자리) 또는 ISBN13(13자리) 형식의 국제 표준 도서번호
   * (International Standard Book Number)
   * ISBN10 또는 ISBN13 중 하나 이상 포함
   * 두 값이 모두 제공될 경우 공백(' ')으로 구분
   */
  isbn:	string;
  // 도서 표지 미리보기 URL
  thumbnail:	string;
  // 도서 출판사
  publisher: string;
  // 도서 저자 리스트
  authors: string[];
}
