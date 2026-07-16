import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(root, "app", "icon.jpeg");

const faviconSizes = [16, 32, 48];
const faviconPngBuffers = await Promise.all(
  faviconSizes.map((size) =>
    sharp(source)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer()
  )
);

const faviconIco = await pngToIco(faviconPngBuffers);
writeFileSync(join(root, "public", "favicon.ico"), faviconIco);

const appleTouchIcon = await sharp(source)
  .resize(180, 180, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .png()
  .toBuffer();

writeFileSync(join(root, "public", "apple-touch-icon.png"), appleTouchIcon);

console.log("Generated public/favicon.ico and public/apple-touch-icon.png");
