const fs = require("fs");
const path = require("path");

// 📂 Path ของโฟลเดอร์ translations และ outputs
const translationRootDir = "translate/website/";
const outputDir = "src/translations/";

// สร้าง output folders ถ้ายังไม่มี
fs.mkdirSync(outputDir, { recursive: true });

function fixLineBreaks(text) {
    return text.replace(/\n/g, ""); // replace new line
}
// 🐫 ฟังก์ชันแปลงสไตล์ key เป็น camelCase
function toCamelCase(str) {
    return str
        .replace(/([-_ ]+)(\w)/g, (_, __, c) => c.toUpperCase())
        .replace(/^([A-Z])/, (_, c) => c.toLowerCase());
}

// ฟังก์ชันแปลง key ที่ไม่ถูกต้องใน TypeScript
function safeKey(key) {
    if (/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(key)) {
        return key; // key ถูกต้องไม่ต้องแปลง
    }
    return `"${key.replace(/"/g, '\\"')}"`; // แปลง key ที่ไม่ถูกต้องเป็น string
}

// ฟังก์ชันจัดการข้อความเป็นTypeScript
function formatToTypescript(obj, indent = "  ") {
  if (typeof obj === "string") {
    return `"${obj.replace(/\\n/g, "\n").replace(/"/g, '\\"')}"`; // Escape ข้อความ
  }

  if (typeof obj === "object" && !Array.isArray(obj)) {
    const content = Object.entries(obj)
      .map(
        ([key, value]) => `${indent}${safeKey(key)}: ${formatToTypescript(value, indent + "  ")}`
      )
      .join(",\n");
    return `{\n${content}\n${indent.slice(2)}}`;
  }

  return JSON.stringify(obj);
}


// ⚙️ ฟังก์ชันสร้างไฟล์ TypeScript จาก translations
function generateLocalizedTranslations() {
  const languages = fs.readdirSync(translationRootDir);

  languages.forEach((lang) => {
    const langDir = path.join(translationRootDir, lang);
    if (!fs.statSync(langDir).isDirectory()) return;

    const mergedData = { translation: {} };

    const files = fs.readdirSync(langDir);
    files.forEach((filename) => {
        const namespace = toCamelCase(path.parse(filename).name);
        const filePath = path.join(langDir, filename);

      if (fs.statSync(filePath).isFile() && path.extname(filename) === ".json") {
        const rawContent = fs.readFileSync(filePath, "utf8");
        const fileContent = JSON.parse(rawContent);

        mergedData.translation[namespace] = {};

        // แก้ไข key ให้เป็น camelCase และแปลงข้อความด้วย fixLineBreaks
        Object.keys(fileContent).forEach((key) => {
          mergedData.translation[namespace][toCamelCase(key)] = fixLineBreaks(
            fileContent[key]
          );
        });
      }
    });

    // 📄 เขียนผลลัพธ์ลง TypeScript ไฟล์
    const outputFilePath = path.join(outputDir, `${lang}.ts`);
    const fileContent = `export const ${lang} = ${formatToTypescript(
      mergedData
    )};`;

    fs.writeFileSync(outputFilePath, fileContent.trim(), "utf8");
    console.log(`✅ Generated: ${outputFilePath}`);
  });
}

// 📦 เรียกใช้งานฟังก์ชัน
generateLocalizedTranslations();