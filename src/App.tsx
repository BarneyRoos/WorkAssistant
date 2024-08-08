import { Tabs } from "antd";
import type { TabsProps } from "antd";
import AvailablePhosphorus from "./AvailablePhosphorus";
import classNames from "./App.module.less";

interface IProps {}
const App = ({}: IProps) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "有效磷",
      children: <AvailablePhosphorus />,
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
      <h1>工作助手</h1>

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default App;
