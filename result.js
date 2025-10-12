const scriptCalendar = require("./script-calendar.json");
const scriptList = require("./script-list-with-match.json");
const fs = require("fs-extra");
const path = require("path");

console.log(scriptList, scriptCalendar);

const result = [];

scriptCalendar.forEach((item) => {
  const date = item["打印日期"];
  const scriptName = item["剧本杀名称"];
  const slogon = item.Slogon;

  const targetScript = scriptList.find(
    (script) => script.scriptName === scriptName
  );

  if (!targetScript) {
    console.log(scriptName, "没找到");
  }

  result.push({
    date,
    scriptName,
    slogon,
    ...targetScript,
  });
});

fs.writeFileSync(
  path.resolve(__dirname, "./poster-web/src/result.json"),
  JSON.stringify(result, null, 2)
);
