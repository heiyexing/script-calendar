import { useEffect, useMemo, useState } from "react";
import "./App.css";
import qs from "qs";
import dayjs from "dayjs";
import { DATE_VACATION_MAP, MONTH_MAP } from "./constants";
import { HolidayUtil, Solar } from "lunar-typescript";
import SCRIPT_LIST from "./result.json";
import { useKeyPress, useLocalStorageState } from "ahooks";

const POSTER_WIDTH = 1000 / 2;
const POSTER_HEIGHT = 1500 / 2;

type ScriptInfo = {
  scriptName: string;
  date: string;
  slogon?: string;
  scriptTextContent?: string;
  scriptLabelNames?: string[];
  scriptScore?: number;
  scriptDifficultyDegreeName?: string;
  scriptIssueInfoItems?: Array<{ issueType: 1 | 2; issueName: string }>;
  panelPosition?: "top" | "bottom";
};

function App() {
  const [scriptList, setScriptList] = useState(SCRIPT_LIST);
  const [index, setIndex] = useState(0);
  const params = useMemo(() => {
    const {
      scriptName = "如故",
      date: _date = "01-01",
      scriptTextContent,
      ...params
    } = scriptList[index] as unknown as ScriptInfo;
    const day = dayjs(_date, "MM-DD").year(2026);
    const year = day.year();
    const month = day.month() + 1;
    const date = day.date();

    const solar = Solar.fromYmd(year, month, date);

    const weekday = solar.getWeekInChinese();
    const festivals = [];

    const vacation =
      DATE_VACATION_MAP[_date] ||
      (["六", "日"].includes(weekday) ? "休" : null);

    if (vacation) {
      festivals.push(vacation);
    }

    festivals.push(...solar.getFestivals().filter((item) => item.length <= 3));

    const lunar = solar.getLunar();
    const lunarMonth = lunar.getMonthInChinese();
    const lunarDate = lunar.getDayInChinese();
    festivals.push(...lunar.getFestivals());
    const jieqi = lunar.getJieQi();

    if (jieqi) {
      festivals.push(jieqi);
    }

    return {
      scriptName,
      scriptImg: location.origin + `/poster/${scriptName}.jpg`,
      festivals,
      scriptTextContent: scriptTextContent
        ?.split("\n")
        .filter((item) => item !== "暂无剧情简介")
        .join("\n"),
      year,
      month,
      date,
      lunarMonth,
      lunarDate,
      weekday,
      ...params,
    };
  }, [index, scriptList]);

  useKeyPress("a", () => {
    setIndex((index) => {
      const oldIndex = index ?? 0;
      return (oldIndex > 0 ? oldIndex - 1 : oldIndex) ?? 0;
    });
  });

  useKeyPress("d", () => {
    setIndex((index) => {
      const oldIndex = index ?? 0;
      return (
        (oldIndex < scriptList.length - 1 ? oldIndex + 1 : oldIndex) ??
        scriptList.length - 1
      );
    });
  });

  // useKeyPress("w", () => {
  //   setScriptList((oldScriptList: any) => {
  //     oldScriptList![index].panelPosition = "top";
  //     return [...oldScriptList];
  //   });
  // });

  // useKeyPress("s", () => {
  //   setScriptList((oldScriptList: any) => {
  //     oldScriptList![index].panelPosition = "bottom";
  //     return [...oldScriptList];
  //   });
  // });

  // useEffect(() => {
  //   const handler = (event: MessageEvent) => {
  //     if (scriptName in event.data) {
  //       setParams(event.data);
  //     }
  //   };
  //   window.addEventListener("message", handler);
  //   return () => {
  //     window.removeEventListener("message", handler);
  //   };
  // }, [setParams]);

  const {
    scriptName,
    scriptImg,
    slogon,
    scriptLabelNames,
    scriptTextContent,
    scriptScore,
    scriptDifficultyDegreeName,
    scriptIssueInfoItems,
    festivals,
    year,
    month,
    date,
    lunarMonth,
    lunarDate,
    weekday,
    panelPosition,
  } = params ?? {};

  return (
    <div className="page">
      <div
        className="poster"
        style={{
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
        }}
      >
        <div
          className="poster-left"
          style={{
            width: POSTER_WIDTH * (0.62 + 0.06),
            paddingLeft: POSTER_WIDTH * 0.06,
            paddingTop: POSTER_WIDTH * 0.06,
            paddingBottom: POSTER_WIDTH * 0.06,
          }}
        >
          <div
            className="poster-info"
            style={{ height: `calc(100% - ${POSTER_HEIGHT * 0.62}px)` }}
          >
            <div className="script-name">{scriptName}</div>
            <div className="script-tags">{scriptLabelNames?.join(" | ")}</div>
            <div className="script-description-panel">
              <div className="script-description">
                {(slogon || scriptTextContent)?.replace(/(\n)+/g, "\n")}
              </div>
            </div>
          </div>

          <img
            className="poster-img"
            src={scriptImg}
            style={{
              width: POSTER_WIDTH * 0.62,
              height: POSTER_HEIGHT * 0.62,
            }}
          />
        </div>

        <div
          className="poster-right"
          style={{
            paddingTop: POSTER_WIDTH * 0.06,
            paddingBottom: POSTER_WIDTH * 0.06,
            paddingRight: POSTER_WIDTH * 0.06,
          }}
        >
          <div>
            <div className="poster-month">
              {year} / {MONTH_MAP[month]}
            </div>
            <div className="poster-date">{String(date).padStart(2, "0")}</div>
            <div className="poster-week">星期{weekday}</div>
            <div className="poster-lunar">
              农历{lunarMonth}月{lunarDate}
            </div>
            <div className="poster-festivals">
              {festivals?.map((festival) => {
                return (
                  <div
                    className="poster-festival"
                    style={{
                      backgroundColor:
                        festival === "补" ? "#0958d9" : undefined,
                    }}
                    key={festival}
                  >
                    {festival}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="poster-tips"
            style={{
              height: POSTER_HEIGHT * 0.62,
              marginLeft: POSTER_WIDTH * 0.03,
            }}
          >
            <div className="poster-tips-title">TIPS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
