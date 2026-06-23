export function getCareerCvExtension(file: { name: string; type: string }) {
  const mimeToExtension: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  };

  const fromType = mimeToExtension[file.type];
  if (fromType) {
    return fromType;
  }

  const lowerName = file.name.trim().toLowerCase();
  if (lowerName.endsWith(".pdf")) return "pdf";
  if (lowerName.endsWith(".docx")) return "docx";
  if (lowerName.endsWith(".doc")) return "doc";

  return null;
}

export function isAcceptedCareerCv(file: { name: string; type: string }) {
  return getCareerCvExtension(file) !== null;
}
