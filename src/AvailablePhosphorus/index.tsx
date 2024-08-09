import { Steps } from "antd";
import { useState } from "react";
import classNames from "./index.module.less";
import DataInput, { IApData } from "./DataInput";
import ExcelPreview, { IExcelData } from "./ExcelPreview";
import WordPreview from "./WordPreview";

interface IProps {
  sampleName: string;
}
const AvailablePhosphorus = ({ sampleName }: IProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fillData, setFillData] = useState<IApData[]>([]);
  const [excelData, setExcelData] = useState<IExcelData[]>([]);

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

      <DataInput visible={currentStep === 0} onDataChange={setFillData} />

      {currentStep === 1 && (
        <ExcelPreview fillData={fillData} onConfirm={setExcelData} />
      )}

      {currentStep === 2 && (
        <WordPreview sampleName={sampleName} excelData={excelData} />
      )}
    </>
  );
};

export default AvailablePhosphorus;
