// 기능별 데이터 파일을 하나로 모으는 진입점입니다.
// app.js는 이 파일에서 handbookItems와 categoryLabels를 가져옵니다.

import { infoItems } from "./info.js";
import { scheduleItems } from "./schedule.js";
import { songItems } from "./songs.js";
import { wordItems } from "./words.js";
import { hanmomItems } from "./hanmom.js";

// 전체 앱에서 렌더링할 항목 목록입니다.
export const handbookItems = [
  ...infoItems,
  ...scheduleItems,
  ...songItems,
  ...wordItems,
  ...hanmomItems,
];

// 카테고리 코드와 화면 표시 이름을 연결합니다.
export const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  memo: "메모",
  hanmom: "마스코트",
};
