// data/private.local.js로 복사해서 사용하는 로컬 전용 개인정보 예시입니다.
// private.local.js는 .gitignore에 포함되어 Git에 올라가지 않습니다.
// 같은 id의 항목에 적은 값만 앱 실행 시 로컬에서 덮어씁니다.

export const privateItemOverrides = [
  {
    id: "day-1",
    // 예: 항공편명, 이름, 조 편성 등이 들어간 schedule을 로컬에서만 관리할 수 있습니다.
    // schedule: [],
  },
];
