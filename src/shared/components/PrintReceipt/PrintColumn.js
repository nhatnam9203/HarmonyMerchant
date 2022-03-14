import _ from "lodash";

export const PrintAlignmentText = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
};

/**
 * Using to add space for each row
 * @param text
 * @param restLength
 * @param align : PrintAlignmentText
 */
export const processAlignText = (text, restLength, align) => {
  switch (align) {
    case PrintAlignmentText.LEFT:
      return text + " ".repeat(restLength);

    case PrintAlignmentText.CENTER:
      return (
        " ".repeat(Math.floor(restLength / 2)) +
        text +
        " ".repeat(Math.ceil(restLength / 2))
      );
    case PrintAlignmentText.RIGHT:
      return " ".repeat(restLength) + text;
    default:
      return "";
  }
};

/**
 * process down line when length of text is bigger than columnWidthAtRow
 * @param text
 * @param maxLength
 */
const processNewLine = (text, maxLength) => {
  let newText;
  let newTextTail;
  const next_char = text.slice(maxLength, maxLength + 1);

  if (next_char === " ") {
    newText = text.slice(0, maxLength);
    newTextTail = text.slice(maxLength, text.length);
  } else {
    const newMaxLength = text
      .slice(0, maxLength)
      .split("")
      .map((e) => e)
      .lastIndexOf(" ");
    if (newMaxLength === -1) {
      newText = text.slice(0, maxLength);
      newTextTail = text.slice(maxLength, text.length);
    } else {
      newText = text.slice(0, newMaxLength);
      newTextTail = text.slice(newMaxLength, text.length);
    }
  }

  return {
    text: newText ?? "",
    text_tail: newTextTail.trim() ?? "",
  };
};

export const processColumnText = (
  texts,
  columnWidth,
  columnAliment,
  columnStyle
) => {
  let rest_texts = ["", "", ""];
  let result = "";
  texts.map((text, idx) => {
    const columnWidthAtRow = Math.round(columnWidth?.[idx]);
    if (text.length >= columnWidth[idx]) {
      const processedText = processNewLine(text, columnWidthAtRow);
      result +=
        (columnStyle?.[idx] ?? "") +
        processAlignText(
          processedText.text,
          columnWidthAtRow - processedText.text.length,
          columnAliment[idx]
        ) +
        (idx !== 2 ? " " : "");
      rest_texts[idx] = processedText.text_tail;
    } else {
      result +=
        (columnStyle?.[idx] ?? "") +
        processAlignText(
          text.trim(),
          columnWidthAtRow - text.length,
          columnAliment[idx]
        ) +
        (idx !== 2 ? " " : "");
    }
  });
  const index_nonEmpty = rest_texts.findIndex((rest_text) => rest_text != "");
  if (index_nonEmpty !== -1) {
    result +=
      "\n" +
      processColumnText(rest_texts, columnWidth, columnAliment, columnStyle);
  }
  return result;
};

export const processTotalLine = (label, value) => {
  return `${_.padEnd(`${label}: `, 15, " ")}${_.padStart(`$${value}`, 9, " ")}`;
};
