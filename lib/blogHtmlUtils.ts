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

function cleanupPastedHtml(html: string): string {
  let result = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)o:p>/gi, "<$1span>")
    .replace(/\sclass="Mso[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*mso-[^"]*"/gi, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/<li>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi, "<li>$1</li>")
    .replace(/<p[^>]*>\s*<\/p>/gi, "");

  result = convertBulletParagraphsToLists(result);
  result = convertOrderedParagraphsToLists(result);

  return result;
}

function convertParagraphTables(html: string): string {
  const paragraphPattern = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = paragraphPattern.exec(html)) !== null) {
    paragraphs.push(stripHtml(match[1]));
  }

  if (paragraphs.length >= 2) {
    const tableHtml = plainTextTableToHtml(paragraphs.join("\n"));
    if (tableHtml) {
      return tableHtml;
    }
  }

  return html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (paragraphMatch, inner) => {
    const text = stripHtml(inner);
    if (!text.includes("|") && !text.includes("\t") && !/\s{2,}/.test(text)) {
      return paragraphMatch;
    }

    const tableHtml = plainTextTableToHtml(text);
    return tableHtml ?? paragraphMatch;
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

function ensureCellBorders(html: string): string {
  if (!TABLE_CELL_TAGS.test(html)) {
    return html;
  }

  return html
    .replace(/<th\b([^>]*)>/gi, (match, attrs) => {
      if (/style\s*=/i.test(attrs)) {
        return match;
      }
      return `<th style="border:1px solid #d1d5db;padding:12px;text-align:left;vertical-align:top;background:#f8fafc;font-weight:700;"${attrs}>`;
    })
    .replace(/<td\b([^>]*)>/gi, (match, attrs) => {
      if (/style\s*=/i.test(attrs)) {
        return match;
      }
      return `<td style="border:1px solid #d1d5db;padding:12px;text-align:left;vertical-align:top;"${attrs}>`;
    });
}

export function normalizeBlogHtml(html: string): string {
  const trimmed = html?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  let result = cleanupPastedHtml(trimmed);

  if (!LIST_TAG.test(result)) {
    const listHtml = plainTextListsToHtml(stripHtml(result));
    if (listHtml) {
      return listHtml;
    }
  }

  if (!TABLE_TAG.test(result)) {
    const converted = plainTextTableToHtml(stripHtml(result));
    if (converted) {
      return converted;
    }
    result = convertParagraphTables(result);
    return result;
  }

  return ensureCellBorders(ensureTableMarkup(result));
}
