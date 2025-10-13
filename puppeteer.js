// 沿用上面的骨架，只改截图部分
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const result = require("./poster-web/src/result.json");

const domain = "http://localhost:5173/";
const outDir = path.resolve(__dirname, "shots");
fs.mkdirSync(outDir, { recursive: true });
fs.emptyDirSync(outDir);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 750, deviceScaleFactor: 2 });

  await page.goto(domain, { waitUntil: "networkidle2" });
  // 2. 等待 .page 节点出现在 DOM 里
  await page.waitForSelector(".poster");

  for (let index = 0; index < 365; index++) {
    await page.waitForNetworkIdle({
      idleTime: 100,
    });
    // 3. 截取这个节点
    const el = await page.$(".poster");
    const outFile = path.join(outDir, `${result[index].date}.png`);
    await el.screenshot({ path: outFile });

    console.log(`${outFile} 已截图`);
    // 1. 按 D 键（如果你仍然需要）
    await page.keyboard.press("KeyD");
  }

  await browser.close();
})();
