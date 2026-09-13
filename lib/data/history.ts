import sourceParts from "./history-source.json";
import timeline from "./history-timeline.json";

const sourceHeadings = new Set([
  "p1-02",
  "p1-06",
  "p1-17",
  "p3-03",
  "p3-08",
  "p4-04",
  "p4-08",
]);

export const historyParagraphs = sourceParts.flatMap((part) =>
  part.paragraphs.map((paragraph) => ({
    ...paragraph,
    kind: sourceHeadings.has(paragraph.id)
      ? "heading"
      : paragraph.id === "p3-06"
        ? "quotation"
        : "paragraph",
  })),
);

const paragraphMap = new Map(
  historyParagraphs.map((paragraph) => [paragraph.id, paragraph]),
);

export const historyTimeline = timeline.map((chapter) => ({
  ...chapter,
  paragraphs: chapter.paragraphIds.map((id) => {
    const paragraph = paragraphMap.get(id);
    if (!paragraph) throw new Error(`Missing history paragraph: ${id}`);
    return paragraph;
  }),
}));

export type HistoryChapter = (typeof historyTimeline)[number];
