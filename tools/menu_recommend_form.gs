/**
 * "삼일핏 메뉴 추천하기" 구글 폼을 만드는 Apps Script.
 *
 * 질문은 데이터팀 엑셀(첫 번째 시트) 열 이름을 그대로 써서, 응답 시트를 엑셀에 옮겨 붙이기 쉽게 했다.
 *   구역 · 식당명 · 메뉴명 · 가격(원)  → 필수
 *   비고                              → 선택
 * 칼로리 · 영업 여부 · 탄단지는 앱 이용자가 알기 어려우니 묻지 않고, 데이터팀이 검토하면서 채운다.
 *
 * 사용법
 *   1. https://script.google.com 에서 새 프로젝트를 만들고 이 파일 내용을 붙여넣기
 *   2. createMenuRecommendForm 실행 (처음 한 번 구글 계정 권한 허용)
 *   3. 실행 로그에 나온 '응답 링크'를 index.html의 RECOMMEND_FORM_URL에 넣기
 */

// 엑셀 '구역' 값 중 tools/xlsx_to_json.py의 AREA 표에 있는 것만 보기로 둔다 (그대로 변환되도록)
const AREA_CHOICES = ['LS타워·아모레', '인근 용리단길', '용산 아이파크몰', '편의점'];

function createMenuRecommendForm() {
  const form = FormApp.create('삼일핏 메뉴 추천하기')
    .setDescription(
      '삼일핏에 넣고 싶은 용산 일대 식당 · 편의점 메뉴를 추천해 주세요.\n' +
      '데이터팀이 확인한 뒤 칼로리 · 영업시간을 채워 앱에 반영합니다.'
    )
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setConfirmationMessage('추천 고마워요! 확인 후 앱에 반영할게요.');

  form.addListItem()
    .setTitle('구역')
    .setHelpText('식당이 있는 곳')
    .setChoiceValues(AREA_CHOICES)
    .setRequired(true);

  form.addTextItem()
    .setTitle('식당명')
    .setHelpText('편의점은 브랜드와 지점까지 (예: GS25 용산LS점)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('메뉴명')
    .setRequired(true);

  form.addTextItem()
    .setTitle('가격(원)')
    .setHelpText('숫자만 (예: 12000)')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('100원 ~ 100,000원 사이 숫자만 입력해 주세요 (쉼표 없이)')
        .requireNumberBetween(100, 100000)
        .build()
    )
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('비고')
    .setHelpText('휴무일 · 추천 이유 · 가격 기준 지점 등 (선택)')
    .setRequired(false);

  // 응답을 모아 볼 스프레드시트 연결 (열: 타임스탬프 · 구역 · 식당명 · 메뉴명 · 가격(원) · 비고)
  const sheet = SpreadsheetApp.create('삼일핏 메뉴 추천하기 (응답)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('응답 링크 (index.html RECOMMEND_FORM_URL): ' + form.getPublishedUrl());
  Logger.log('폼 편집: ' + form.getEditUrl());
  Logger.log('응답 시트: ' + sheet.getUrl());
}
