const TABLE_CELL_TAGS = /<(td|th)\b/i;
const TABLE_TAG = /<table\b/i;
const LIST_TAG = /<(ul|ol)\b/i;
const BULLET_PREFIX = /^[\u2022\u25CF\u25CB\u25AA•\-\*]\s+(.+)$/;
const ORDERED_PREFIX = /^\d+[\.\)]\s+(.+)$/;

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.includes("\t")) {
    return trimmed.split("\t").map((cell) => cell.trim());
  }

  if (trimmed.includes("|")) {
    return trimmed
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);
  }

  return trimmed.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
}

function buildTableHtml(rows: string[][]): string {
  if (rows.length === 0) {
    return "";
  }

  const [header, ...body] = rows;
  const headerHtml = header
    .map((cell) => `<th>${escapeHtml(cell)}</th>`)
    .join("");
  const bodyHtml = body
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #d1d5db;"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export function plainTextTableToHtml(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const rows = lines.map(splitTableRow).filter((row) => row.length > 1);
  if (rows.length < 2) {
    return null;
  }

  const columnCount = rows[0].length;
  if (!rows.every((row) => row.length === columnCount)) {
    return null;
  }

  return buildTableHtml(rows);
}

export function plainTextListsToHtml(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const bulletLines = lines.filter((line) => BULLET_PREFIX.test(line));
  const orderedLines = lines.filter((line) => ORDERED_PREFIX.test(line));

  if (bulletLines.length >= 2 && bulletLines.length === lines.length) {
    const items = lines
      .map((line) => line.replace(BULLET_PREFIX, "$1"))
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  if (orderedLines.length >= 2 && orderedLines.length === lines.length) {
    const items = lines
      .map((line) => line.replace(ORDERED_PREFIX, "$1"))
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }

  return null;
}

function convertBulletParagraphsToLists(html: string): string {
  const bulletBlockPattern =
    /(?:<p[^>]*>\s*(?:&nbsp;|\u00a0|\s)*[•\u2022\u25CF\u25CB\u25AA\-\*]\s*([\s\S]*?)<\/p>\s*)+/gi;

  return html.replace(bulletBlockPattern, (block) => {
    const items = [...block.matchAll(
      /<p[^>]*>\s*(?:&nbsp;|\u00a0|\s)*[•\u2022\u25CF\u25CB\u25AA\-\*]\s*([\s\S]*?)<\/p>/gi,
    )]
      .map((match) => `<li>${match[1].trim()}</li>`)
      .join("");
    return items ? `<ul>${items}</ul>` : block;
  });
}

function convertOrderedParagraphsToLists(html: string): string {
  const orderedBlockPattern =
    /(?:<p[^>]*>\s*(?:&nbsp;|\u00a0|\s)*\d+[\.\)]\s*([\s\S]*?)<\/p>\s*)+/gi;

  return html.replace(orderedBlockPattern, (block) => {
    const items = [...block.matchAll(
      /<p[^>]*>\s*(?:&nbsp;|\u00a0|\s)*\d+[\.\)]\s*([\s\S]*?)<\/p>/gi,
    )]
      .map((match) => `<li>${match[1].trim()}</li>`)
      .join("");
    return items ? `<ol>${items}</ol>` : block;
  });
}

function unwrapGoogleDocsWrapper(html: string): string {
  return html.replace(
    /<b\b[^>]*\bid="docs-internal-guid[^"]*"[^>]*>([\s\S]*?)<\/b>/gi,
    "$1",
  );
}

function normalizeLine(line: string): string {
  return line.replace(/\u00a0/g, " ").trim();
}

function parseBulletText(line: string): string | null {
  const text = normalizeLine(line);
  const match = text.match(/^[•\u2022\u25CF\u25CB\u25AA\-\*]\s*(.+)$/);
  if (match) {
    return match[1].trim();
  }
  if (text.startsWith("•")) {
    return text.slice(1).trim();
  }
  return null;
}

function trySplitTableRow(line: string): string[] | null {
  const text = normalizeLine(line);
  if (!text) {
    return null;
  }

  if (text.includes("\t")) {
    const columns = text.split("\t").map((cell) => cell.trim()).filter(Boolean);
    return columns.length >= 2 ? columns : null;
  }

  if (text.includes("|")) {
    const columns = text.split("|").map((cell) => cell.trim()).filter(Boolean);
    return columns.length >= 2 ? columns : null;
  }

  if (/^Category\s+Level\s+Proficiency$/i.test(text)) {
    return ["Category", "Level", "Proficiency"];
  }

  const categoryRow = text.match(
    /^(Basic|Independent|Proficient)\s+User\s+([ABC][12](?:,\s*[ABC][12])?)\s+(.+)$/i,
  );
  if (categoryRow) {
    return [`${categoryRow[1]} User`, categoryRow[2], categoryRow[3]];
  }

  if (/^Exam\s+Tested Levels?\s+Suitable For$/i.test(text)) {
    return ["Exam", "Tested Levels", "Suitable For"];
  }

  const examNames = ["Goethe-Zertifikat", "TELC", "TestDaF", "DSH", "ÖSD", "OSD"];
  for (const exam of examNames) {
    if (text.startsWith(exam)) {
      const rest = text.slice(exam.length).trim();
      const match = rest.match(/^([A-Z0-9][A-Z0-9,\-\s]*?)\s+(.+)$/i);
      if (match) {
        return [exam, match[1].trim(), match[2].trim()];
      }
    }
  }

  if (/^German Language Levels\s+Time Required/i.test(text)) {
    return ["German Language Levels", "Time Required To Learn In Hours"];
  }

  const levelHours = text.match(/^(A[12]|B[12]|C[12])\s+(.+)$/i);
  if (levelHours && /hour/i.test(levelHours[2])) {
    return [levelHours[1], levelHours[2].trim()];
  }

  if (/^Program Type\s+Required Level$/i.test(text)) {
    return ["Program Type", "Required Level"];
  }

  const programTypes = [
    "Foundation/Studienkolleg",
    "Bachelor's Degree (in German)",
    "Master's Degree (in German)",
    "English-taught programs",
  ];
  for (const program of programTypes) {
    if (text.startsWith(program)) {
      return [program, text.slice(program.length).trim()];
    }
  }

  if (/^Profession\s+Recommended Level/i.test(text)) {
    return ["Profession", "Recommended Level of German"];
  }

  const professions = [
    "Hospitality & Customer Services",
    "IT and Engineering",
    "Business and Management",
    "Sales and Marketing",
    "Teaching and Public Sector Positions",
  ];
  for (const profession of professions) {
    if (text.startsWith(profession)) {
      return [profession, text.slice(profession.length).trim()];
    }
  }

  if (/\s{2,}/.test(text)) {
    const columns = text.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
    if (columns.length >= 2 && columns.length <= 5) {
      return columns;
    }
  }

  return null;
}

function isTableRow(line: string): boolean {
  return trySplitTableRow(line) !== null;
}

function collectTableRows(lines: string[], startIndex: number): string[][] | null {
  const firstRow = trySplitTableRow(normalizeLine(lines[startIndex]));
  if (!firstRow) {
    return null;
  }

  const rows: string[][] = [firstRow];
  let cursor = startIndex + 1;

  while (cursor < lines.length) {
    const nextRow = trySplitTableRow(normalizeLine(lines[cursor]));
    if (!nextRow || nextRow.length !== firstRow.length) {
      break;
    }
    rows.push(nextRow);
    cursor += 1;
  }

  return rows.length >= 2 ? rows : null;
}

function convertInlineParagraphTables(html: string): string {
  if (TABLE_TAG.test(html)) {
    return html;
  }

  return html.replace(/((?:<p\b[^>]*>[\s\S]*?<\/p>\s*){2,})/gi, (block) => {
    const texts = [...block.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) =>
      stripHtml(match[1]),
    );
    const rows = texts.map((text) => trySplitTableRow(text));

    if (
      rows.length >= 2 &&
      rows.every((row) => row !== null) &&
      rows.every((row) => row!.length === rows[0]!.length)
    ) {
      return buildTableHtml(rows as string[][]);
    }

    return block;
  });
}

function isBlogH2(line: string, lineIndex: number): boolean {
  const text = normalizeLine(line);
  if (!text) {
    return false;
  }

  if (lineIndex === 0 && text.length <= 220 && !/[.!?]$/.test(text)) {
    return true;
  }

  if (/^German [ABC][12] Level:/i.test(text)) {
    return true;
  }

  return /^(German Language Levels Explained|German Language Certification Exams|Time to Study German Language|Reasons for Learning German|Education Possibilities|Professional Success|Global Business Advantage|Cultural Value|Advantages for Immigrants|Conclusion|FAQ)$/i.test(
    text,
  ) || /^Advantages for Immigrants and Settlers$/i.test(text);
}

function isBlogH3(line: string): boolean {
  const text = normalizeLine(line);
  if (!text) {
    return false;
  }

  if (/^\d+\.\s/.test(text)) {
    return true;
  }

  return (
    /^What (?:You|you)/i.test(text) ||
    /^(Topics Covered|Subjects Taught|Duration)$/i.test(text) ||
    /^(Certification Recommended|Suggested Test|Suggested Exam|Suggested Examination|Examination Recommended|Recommended Examination|Test recommendation)$/i.test(text) ||
    /^(Career Benefits|Career Prospects|Professional advantages|Advantages of Learning)/i.test(text) ||
    /^Skills Developed at/i.test(text) ||
    /^Highly demanded in:$/i.test(text) ||
    /^The .+ is advantageous for the following professionals:$/i.test(text) ||
    /^Some things you need/i.test(text) ||
    /^Here is how CEFR/i.test(text)
  );
}

function startsListSection(line: string): boolean {
  return /What (?:You|you)|Topics Covered|Subjects Taught|Highly demanded|advantageous for the following|Some things you need/i.test(
    normalizeLine(line),
  );
}

function isListItemLine(line: string, listMode: boolean): boolean {
  const text = normalizeLine(line);
  if (!text || isBlogH2(text, -1) || isBlogH3(text) || isTableRow(text)) {
    return false;
  }
  if (parseBulletText(text)) {
    return true;
  }
  if (!listMode) {
    return false;
  }
  if (text.length > 150 && text.endsWith(".")) {
    return false;
  }
  return true;
}

function htmlLinesToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/t[dh]>/gi, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function structureBlogPlainText(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const parts: string[] = [];
  let listItems: string[] = [];
  let listMode = false;
  let lineIndex = 0;

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    parts.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    listItems = [];
    listMode = false;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = normalizeLine(rawLine);
    if (!line) {
      flushList();
      continue;
    }

    if (isTableRow(line)) {
      flushList();
      const rows = collectTableRows(lines, index);
      if (rows) {
        parts.push(buildTableHtml(rows));
        index += rows.length - 1;
        lineIndex += 1;
        continue;
      }
    }

    const bulletText = parseBulletText(line);
    if (bulletText) {
      listItems.push(bulletText);
      lineIndex += 1;
      continue;
    }

    if (isBlogH2(line, lineIndex)) {
      flushList();
      parts.push(`<h2>${escapeHtml(line)}</h2>`);
      lineIndex += 1;
      continue;
    }

    if (isBlogH3(line)) {
      flushList();
      const h3Text = line.replace(/:+$/, "").trim();
      parts.push(`<h3>${escapeHtml(h3Text)}</h3>`);
      listMode = startsListSection(line);
      lineIndex += 1;
      continue;
    }

    if (isListItemLine(line, listMode)) {
      listItems.push(line);
      lineIndex += 1;
      continue;
    }

    flushList();
    parts.push(`<p>${escapeHtml(line)}</p>`);
    lineIndex += 1;
  }

  flushList();
  return parts.join("");
}

function lightCleanupPastedHtml(html: string): string {
  let result = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)o:p>/gi, "<$1span>")
    .replace(/\sclass="Mso[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*mso-[^"]*"/gi, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/<p[^>]*>\s*<\/p>/gi, "");

  result = unwrapGoogleDocsWrapper(result);
  result = result
    .replace(/<h1\b([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");

  if (!LIST_TAG.test(result)) {
    result = convertBulletParagraphsToLists(result);
    result = convertOrderedParagraphsToLists(result);
  }

  return result;
}

function applyBlogStructure(html: string): string {
  if (/<h[23]\b/i.test(html) && TABLE_TAG.test(html) && LIST_TAG.test(html)) {
    return html;
  }

  const plainText = htmlLinesToPlainText(html);
  if (!plainText) {
    return html;
  }

  const structured = structureBlogPlainText(plainText);
  return structured || html;
}

function cleanupPastedHtml(html: string): string {
  let result = lightCleanupPastedHtml(html);
  result = convertInlineParagraphTables(result);

  if (!/<h[23]\b/i.test(result)) {
    result = applyBlogStructure(result);
  } else if (!TABLE_TAG.test(result)) {
    result = convertInlineParagraphTables(result);
    if (!TABLE_TAG.test(result)) {
      const structured = structureBlogPlainText(htmlLinesToPlainText(result));
      if (structured && TABLE_TAG.test(structured)) {
        result = structured;
      }
    }
  }

  return normalizeListMarkup(result);
}

const LIST_INDENT_STYLE_PROPS = new Set([
  "margin",
  "margin-left",
  "margin-right",
  "padding-left",
  "text-indent",
]);

const TYPOGRAPHY_STYLE_PROPS = new Set([
  "font",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-variant",
  "color",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-transform",
  "background",
  "background-color",
  "vertical-align",
  "text-decoration",
  "text-indent",
  "widows",
  "orphans",
]);

function cleanStyleAttribute(style: string, blockedProps: Set<string>): string {
  const kept = style
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .filter((rule) => {
      const prop = rule.split(":")[0]?.trim().toLowerCase() ?? "";
      if (!prop) {
        return false;
      }
      if (blockedProps.has(prop)) {
        return false;
      }
      if (prop.startsWith("mso-")) {
        return false;
      }
      return true;
    });

  return kept.join("; ");
}

function stripStylePropsFromTag(html: string, tag: string, blockedProps: Set<string>): string {
  const pattern = new RegExp(`<${tag}\\b([^>]*?)\\sstyle="([^"]*)"([^>]*)>`, "gi");

  return html.replace(pattern, (_match, before, style, after) => {
    const cleanedStyle = cleanStyleAttribute(style, blockedProps);
    if (!cleanedStyle) {
      return `<${tag}${before}${after}>`;
    }
    return `<${tag}${before} style="${cleanedStyle}"${after}>`;
  });
}

function cleanListStyleAttribute(style: string): string {
  return cleanStyleAttribute(style, LIST_INDENT_STYLE_PROPS);
}

function stripListIndentStyles(html: string, tag: "ul" | "ol" | "li"): string {
  const pattern = new RegExp(`<${tag}\\b([^>]*?)\\sstyle="([^"]*)"([^>]*)>`, "gi");

  return html.replace(pattern, (match, before, style, after) => {
    const cleanedStyle = cleanListStyleAttribute(style);
    if (!cleanedStyle) {
      return `<${tag}${before}${after}>`;
    }
    return `<${tag}${before} style="${cleanedStyle}"${after}>`;
  });
}

function normalizeListMarkup(html: string): string {
  if (!/<(ul|ol|li)\b/i.test(html)) {
    return html;
  }

  let result = html;
  result = stripListIndentStyles(result, "ul");
  result = stripListIndentStyles(result, "ol");
  result = stripListIndentStyles(result, "li");

  for (let pass = 0; pass < 3; pass += 1) {
    const next = result.replace(
      /<li>\s*<p\b[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi,
      "<li>$1</li>",
    );
    if (next === result) {
      break;
    }
    result = next;
  }

  return result;
}

function unwrapRedundantSpans(html: string): string {
  let result = html;

  for (let pass = 0; pass < 6; pass += 1) {
    const next = result
      .replace(/<span\b[^>]*>\s*<\/span>/gi, "")
      .replace(/<span\b[^>]*>([\s\S]*?)<\/span>/gi, "$1");
    if (next === result) {
      break;
    }
    result = next;
  }

  return result;
}

function normalizeTypography(html: string): string {
  const tags = ["p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a", "strong", "em", "td", "th"];
  let result = html;

  for (const tag of tags) {
    result = stripStylePropsFromTag(result, tag, TYPOGRAPHY_STYLE_PROPS);
  }

  result = result
    .replace(/\sclass="Mso[^"]*"/gi, "")
    .replace(/\sstyle="\s*"/gi, "")
    .replace(/\sface="[^"]*"/gi, "")
    .replace(/\s(size|color)="[^"]*"/gi, "");

  return unwrapRedundantSpans(result);
}

function ensureTableHeader(html: string): string {
  if (!TABLE_TAG.test(html)) {
    return html;
  }

  return html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (tableMatch, inner) => {
    if (/<thead\b/i.test(inner)) {
      return tableMatch;
    }

    const firstRowMatch = inner.match(/<tr\b[^>]*>([\s\S]*?)<\/tr>/i);
    if (!firstRowMatch) {
      return tableMatch;
    }

    const firstRow = firstRowMatch[0];
    const firstRowCells = firstRow.match(/<(td|th)\b[^>]*>[\s\S]*?<\/\1>/gi);
    if (!firstRowCells || firstRowCells.length === 0) {
      return tableMatch;
    }

    const headerCells = firstRowCells
      .map((cell: string) =>
        cell.replace(/^<td\b/i, "<th").replace(/<\/td>$/i, "</th>"),
      )
      .join("");
    const headerRow = `<thead><tr>${headerCells}</tr></thead>`;
    const rest = inner.replace(firstRow, "").replace(/^\s*<tbody\b[^>]*>/i, "").replace(/<\/tbody>\s*$/i, "");
    const bodyContent = rest.trim();

    return tableMatch.replace(
      inner,
      `${headerRow}${bodyContent ? `<tbody>${bodyContent}</tbody>` : ""}`,
    );
  });
}

function ensureCellBorders(html: string): string {
  if (!TABLE_CELL_TAGS.test(html)) {
    return html;
  }

  return html
    .replace(/<th\b([^>]*)>/gi, (match, attrs) => {
      if (/style\s*=/i.test(attrs)) {
        return match;
      }
      return `<th style="border:1px solid #d1d5db;padding:12px;text-align:left;vertical-align:top;background:#f1f5f9;font-weight:700;color:#0b1f44;"${attrs}>`;
    })
    .replace(/<td\b([^>]*)>/gi, (match, attrs) => {
      if (/style\s*=/i.test(attrs)) {
        return match;
      }
      return `<td style="border:1px solid #d1d5db;padding:12px;text-align:left;vertical-align:top;"${attrs}>`;
    });
}

function ensureTableMarkup(html: string): string {
  return html.replace(/<table\b([^>]*)>/gi, (match, attrs) => {
    if (/border\s*=|style\s*=/i.test(attrs)) {
      return match;
    }

    return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #d1d5db;"${attrs}>`;
  });
}

export function preparePastedBlogHtml(html: string): string {
  const trimmed = html?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  let result = cleanupPastedHtml(trimmed);

  if (TABLE_TAG.test(result)) {
    result = ensureTableHeader(ensureCellBorders(ensureTableMarkup(result)));
  }

  return result;
}

export function sanitizeBlogHtml(html: string): string {
  return normalizeTypography(preparePastedBlogHtml(html));
}

export function convertPlainTextPaste(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  if (/<[a-z][\s>]/i.test(trimmed)) {
    return preparePastedBlogHtml(trimmed);
  }

  return structureBlogPlainText(trimmed) || trimmed;
}

export function normalizeBlogHtml(html: string): string {
  return sanitizeBlogHtml(html);
}
