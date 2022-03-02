import _ from "lodash";

/**
 * Using to add space for each row
 * @param text
 * @param restLength
 * @param align
 */
const processAlignText = (text, restLength, align) => {
  if (align === 0) {
    return text + " ".repeat(restLength);
  } else if (align === 1) {
    return (
      " ".repeat(Math.floor(restLength / 2)) +
      text +
      " ".repeat(Math.ceil(restLength / 2))
    );
  } else if (align === 2) {
    return " ".repeat(restLength) + text;
  }
  return "";
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
