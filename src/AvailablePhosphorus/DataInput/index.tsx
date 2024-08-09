import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Radio } from "antd";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import classNames from "../index.module.less";

/**
 * 有效磷数据类型
 * @field {string} code 编号 TR86823NX03-01，递增
 * @field {number} A 计算变量，三位小数
 * @field {number} H2O 计算变量，%
 */
export interface IApData {
  code: string;
  A: number;
  H2O: number;
  D: 5 | 10 | 25;
}

interface IProps {
  visible: boolean;
  onDataChange: (data: IApData[]) => void;
}
const DataInput = ({ visible, onDataChange }: IProps) => {
  const [data, setData] = useState<IApData[]>([]);
  const [codeAffix, setCodeAffix] = useState<string>("");

  useEffect(() => {
    onDataChange(data);
  }, [JSON.stringify(data)]);

  const onCodeAffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeAffix(e.target.value.toUpperCase());
  };

  const onCreateRow = () => {
    setData([
      ...data,
      {
        code: codeAffix + "-" + (data.length + 1),
        A: 0,
        H2O: 0,
        D: 5,
      },
    ]);
  };

  const onRemoveRow = (row: IApData) => {
    const newData = data.filter((item) => item.code !== row.code);
    setData(newData);
  };

  const onFieldChange = (
    row: IApData,
    fieldName: keyof IApData,
    value: any
  ) => {
    const targetRow = data.find((item) => item.code === row.code);
    if (targetRow) {
      (targetRow[fieldName] as any) = value;
      setData([...data]);
    }
  };

  const columns: TableProps<IApData>["columns"] = [
    {
      title: (
        <>
          编号{" "}
          <Input
            style={{ display: "inline-block", width: 200 }}
            value={codeAffix}
            placeholder="请输入编号前半部分"
            onChange={onCodeAffixChange}
          />
        </>
      ),
      dataIndex: "code",
      align: "center",
      width: 500,
      render: (text) => <Input value={text} />,
    },
    {
      title: "A",
      dataIndex: "A",
      align: "center",
      render: (text, record) => (
        <InputNumber
          value={text}
          defaultValue={0}
          min={0}
          max={1}
          controls={false}
          onChange={(value) => onFieldChange(record, "A", value)}
        />
      ),
    },
    {
      title: "D",
      dataIndex: "D",
      align: "center",
      render: (text, record) => (
        <Radio.Group
          onChange={(e) => onFieldChange(record, "D", e.target.value)}
          value={text}
        >
          <Radio value={5}>5</Radio>
          <Radio value={10}>10</Radio>
          <Radio value={25}>25</Radio>
        </Radio.Group>
      ),
    },
    {
      title: (
        <>
          H<sub>2</sub> O(%)
        </>
      ),
      dataIndex: "H2O",
      align: "center",
      render: (text, record) => (
        <InputNumber
          value={text}
          defaultValue={0}
          min={0}
          max={100}
          controls={false}
          onChange={(value) => onFieldChange(record, "H2O", value)}
        />
      ),
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <Button danger onClick={() => onRemoveRow(record)}>
          删除
        </Button>
      ),
    },
  ];
  return (
    <div style={{ display: visible ? "block" : "none" }}>
      <Table
        style={{ marginTop: 20 }}
        rowKey={(row) => row.code}
        columns={columns}
        dataSource={data}
        pagination={{ position: [] }}
        scroll={{ y: 400 }}
      />

      <div className={classNames.actionBox}>
        <Button
          type="primary"
          style={{ width: "49%" }}
          icon={<PlusOutlined />}
          onClick={onCreateRow}
          disabled={!codeAffix}
        >
          新增一行
          {!codeAffix && "（请先输入编号前半部分）"}
        </Button>

        <Button
          danger
          style={{ width: "49%" }}
          icon={<DeleteOutlined />}
          onClick={() => setData([])}
        >
          清空表格
        </Button>
      </div>
    </div>
  );
};

export default DataInput;
