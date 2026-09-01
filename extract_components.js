
const fs = require("fs");
let pageCode = fs.readFileSync("app/page.tsx", "utf8");

function getCompCode(name) {
  const startStr = "function " + name + "() {";
  const startIndex = pageCode.indexOf(startStr);
  if (startIndex === -1) return "";
  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex; i < pageCode.length; i++) {
    if (pageCode[i] === "{") braceCount++;
    if (pageCode[i] === "}") {
      braceCount--;
      if (braceCount === 0) { endIndex = i; break; }
    }
  }
  let compCode = pageCode.substring(startIndex, endIndex + 1);
  pageCode = pageCode.slice(0, startIndex) + pageCode.slice(endIndex + 1);
  return compCode;
}

const smartLearning = getCompCode("SmartLearningSection");
const examPrep = getCompCode("ExamPrepSection");
const whyChoose = getCompCode("WhyChooseSection");

if(smartLearning) fs.writeFileSync("app/components/SmartLearningSection.tsx", "import React from \"react\";\n\nexport default " + smartLearning);
if(examPrep) fs.writeFileSync("app/components/ExamPrepSection.tsx", "import React from \"react\";\nimport Link from \"next/link\";\nimport Image from \"next/image\";\n\nexport default " + examPrep);
if(whyChoose) fs.writeFileSync("app/components/WhyChooseSection.tsx", "import React from \"react\";\nimport Image from \"next/image\";\n\nexport default " + whyChoose);

const importsToAdd = `
import SmartLearningSection from "./components/SmartLearningSection";
import ExamPrepSection from "./components/ExamPrepSection";
import WhyChooseSection from "./components/WhyChooseSection";
`;
pageCode = pageCode.replace("import Link from \"next/link\";", "import Link from \"next/link\";" + importsToAdd);
fs.writeFileSync("app/page.tsx", pageCode);
console.log("Extraction complete.");

