import React, { useEffect, useState } from "react";
import { Calendar, Select, Modal, Button, Spin, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { useLocalStorageState } from "ahooks";
import { Lunar } from "lunar-typescript";

dayjs.extend(weekday);
dayjs.extend(localeData);

const { Option } = Select;

export default function CalendarPage() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedScript, setSelectedScript] = useState("");
  const [visible, setVisible] = useState(false);
  const [dateScriptMap, setDateScriptMap] = useLocalStorageState<{
    [key: string]: string;
  }>("script-calendar-map", {
    defaultValue: {},
  });

  // 只显示 2026 年
  const validRange = [dayjs("2026-01-01"), dayjs("2026-12-31")] as [
    Dayjs,
    Dayjs
  ];

  useEffect(() => {
    // 并行获取两个 json
    Promise.all([
      fetch("/scripts.json").then((res) => res.json()),
      fetch("/script-calendar.json").then((res) => res.json()),
    ]).then(([scriptsData, calendarData]) => {
      // 排序规则：1) match:true 置顶 2) 在同一分组内按 scriptScore 降序
      const sorted = [...scriptsData].sort((a: any, b: any) => {
        const am = !!a.match;
        const bm = !!b.match;
        if (am !== bm) return am ? -1 : 1; // true 在前
        return b.scriptScoreCount - a.scriptScoreCount; // 分数高在前
      });
      setScripts(sorted);
      setCalendarData(calendarData);
      if (Object.keys(dateScriptMap).length === 0) {
        // 初始化 map
        const map: { [key: string]: string } = {};
        calendarData.forEach((item: any) => {
          map[item["打印日期"]] = item["剧本杀名称"];
        });
        setDateScriptMap(map);
      }
      setLoading(false);
    });
  }, []);

  const dateCellRender = (date: Dayjs) => {
    if (date.year() !== 2026) return null;
    const mmdd = date.format("MM-DD");
    const script = dateScriptMap[mmdd];
    const targetScript = scripts.find((s) => s.scriptName === script);
    const d = Lunar.fromDate(date.toDate());
    const festival = [...d.getFestivals(), ...d.getOtherFestivals()];
    return script ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "column",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 6,
            top: 6,
            fontSize: 12,
            color: festival.length ? "red" : undefined,
          }}
        >
          {festival.join(",") || d.getDayInChinese()}
        </span>
        {targetScript?.scriptCoverUrl && (
          <img src={targetScript.scriptCoverUrl} style={{ width: 30 }} />
        )}
        <div style={{ color: "#1677ff", fontWeight: 500, fontSize: 12 }}>
          {script}
        </div>
      </div>
    ) : null;
  };

  const onSelect = (value: any) => {
    setSelectedDate(value);
    setSelectedScript(dateScriptMap[value.format("MM-DD")] || "");
    setVisible(true);
  };

  const handleOk = () => {
    const mmdd = selectedDate.format("MM-DD");
    const newDateScriptMap: any = { ...dateScriptMap, [mmdd]: selectedScript };
    const dates = Object.keys(newDateScriptMap);
    for (const date of dates) {
      if (newDateScriptMap[date] === selectedScript && date !== mmdd) {
        delete newDateScriptMap[date];
      }
    }
    setDateScriptMap(newDateScriptMap);
    setVisible(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const selectedScriptNames = new Set(Object.values(dateScriptMap));

  return (
    <div style={{ margin: "0 auto", padding: 24 }}>
      <h2>2026 剧本日历</h2>
      <Calendar
        validRange={validRange}
        cellRender={dateCellRender}
        fullscreen={true}
        onSelect={onSelect}
        defaultValue={dayjs("2026-01-01")}
      />
      <Modal
        title={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Select
          autoFocus
          allowClear
          showSearch
          style={{ width: "100%" }}
          placeholder="选择剧本名称"
          value={selectedScript}
          onChange={(value) => {
            setSelectedScript(value);
          }}
          filterOption={(input, option) => {
            return option?.key.toLowerCase().includes(input.toLowerCase());
          }}
        >
          {scripts.map((script: any) => {
            return (
              <Option
                key={script.scriptName}
                value={script.scriptName}
                style={{
                  backgroundColor: selectedScriptNames.has(script.scriptName)
                    ? "#cccccc"
                    : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{script.scriptName}</span>
                  {script.match && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      匹配
                    </Tag>
                  )}
                  {selectedScriptNames.has(script.scriptName) && (
                    <Tag color="green">已选</Tag>
                  )}
                </div>
              </Option>
            );
          })}
        </Select>
      </Modal>
      <div style={{ marginTop: 24 }}>
        <Button
          type="primary"
          onClick={() => {
            // 导出为 JSON
            const arr = Object.entries(dateScriptMap)
              .map(([date, name]) => {
                const target = calendarData.find(
                  (item) => item["剧本杀名称"] === name
                );
                return {
                  花名: target ? target["花名"] : undefined,
                  Slogon: target ? target["Slogon"] : undefined,
                  打印日期: date,
                  剧本杀名称: name,
                };
              })
              .sort((a, b) =>
                dayjs(a["打印日期"], "MM-DD").isBefore(
                  dayjs(b["打印日期"], "MM-DD")
                )
                  ? -1
                  : 1
              );

            debugger;
            const blob = new Blob([JSON.stringify(arr, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "script-calendar.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          导出剧本日历
        </Button>
      </div>
    </div>
  );
}
