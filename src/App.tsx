import { Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import AvailablePhosphorus from "./AvailablePhosphorus";
import classNames from "./App.module.less";
import { useState } from "react";

interface IProps {}
const App = ({}: IProps) => {
  const [sampleName, setSampleName] = useState<string>("");

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "有效磷",
      children: <AvailablePhosphorus sampleName={sampleName} />,
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className={classNames.app}>
      <h1>分光光度法（土壤）分析原始记录</h1>
      <div className={classNames.sample}>
        样品名称：
        <Input
          style={{ display: "inline-block", width: 400 }}
          value={sampleName}
          placeholder="请输入样品名称"
          onChange={(e) => setSampleName(e.target.value)}
        />
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default App;
