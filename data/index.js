import { infoItems } from "./info.js";
import { scheduleItems } from "./schedule.js";
import { sermonItems } from "./sermons.js";
import { songItems } from "./songs.js";
import { wordItems } from "./words.js";

export const handbookItems = [
  ...infoItems,
  ...scheduleItems,
  ...songItems,
  ...wordItems,
  ...sermonItems,
];

export const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  memo: "메모",
};
