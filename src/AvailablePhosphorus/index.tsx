import { Steps } from "antd";
import { useState } from "react";
import classNames from "./index.module.less";
import DataInput, { IApData } from "./DataInput";
import ExcelPreview from "./ExcelPreview";

interface IProps {}
const AvailablePhosphorus = ({}: IProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [data, setData] = useState<IApData[]>([]);

  const onClickStep = (current: number) => {
    setCurrentStep(current);
  };

  return (
    <>
      <div className={classNames.steps}>
        <Steps
          style={{ width: "60%" }}
          current={currentStep}
          onChange={onClickStep}
          items={[
            {
              title: "数据录入",
            },
            {
              title: "表格预览&导出",
            },
            {
              title: "Word预览&导出",
            },
          ]}
        />
      </div>

      <DataInput visible={currentStep === 0} onDataChange={setData} />

      {currentStep === 1 && <ExcelPreview data={data} />}
    </>
  );
};

export default AvailablePhosphorus;
