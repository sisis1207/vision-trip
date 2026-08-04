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

// data/private.local.js에서 같은 id의 항목을 덮어쓸 때 사용합니다.
// local 파일은 .gitignore에 포함되어 개인정보를 Git에 올리지 않습니다.
export function applyPrivateItemOverrides(items, overrides = []) {
  const overridesById = new Map(
    overrides
      .filter((item) => item?.id)
      .map((item) => [item.id, item]),
  );

  return items.map((item) => {
    const override = overridesById.get(item.id);
    if (!override) return item;

    const { id, category, ...localFields } = override;
    return { ...item, ...localFields };
  });
}

// 카테고리 코드와 화면 표시 이름을 연결합니다.
export const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  memo: "메모",
  hanmom: "마스코트",
};
