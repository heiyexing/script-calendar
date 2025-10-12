const scripts = require("./script-list.json");
const scriptCalendar = require("./script-calendar.json");
const pLimit = require("p-limit").default;
const fs = require("fs-extra");
const sharp = require("sharp");
const path = require("path");

const limit = pLimit(10);
const scriptNamesInCalendar = new Set(
  scriptCalendar.map((item) => item["剧本杀名称"])
);

const posterDirName = path.resolve(__dirname, "./poster");

(async () => {
  await Promise.all(
    scripts.map((script) => {
      limit(async () => {
        if (!scriptNamesInCalendar.has(script.scriptName)) {
          return;
        }
        const filePath = path.resolve(
          posterDirName,
          `${script.scriptName}.jpg`
        );
        if (fs.existsSync(filePath)) {
          // console.log(`${script.scriptName} exists, skip download.`);
          return;
        }
        const buffer = await fetch(script.scriptCoverUrl, {
          timeout: 60 * 1000,
        })
          .then((res) => res.arrayBuffer())
          .catch((err) => {
            console.error(`Failed to download ${script.scriptName}: ${err}`);
            return null;
          });
        if (!buffer) {
          return;
        }
        const sharpImg = await sharp(buffer).jpeg();

        const imgBuffer = await sharpImg.toBuffer();

        fs.writeFileSync(filePath, imgBuffer);
        console.log(`Downloaded ${script.scriptName}`);
      });
    })
  );

  const posterNames = fs.readdirSync(posterDirName);
  posterNames.forEach(async (posterName) => {
    const filePath = path.resolve(posterDirName, posterName);
    const {width, height} = await sharp(filePath).metadata();
    if (width > height) {
      console.log(path.resolve(posterDirName, posterName));
    }
  });
})();
