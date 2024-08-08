import { useEffect, useState } from "react";
import { IApData } from "../DataInput";
import Decimal from "decimal.js";
import { Button, Table } from "antd";
import type { TableProps } from "antd";
import * as XLSX from "xlsx";

/**
 * @field {number} A0 默认为0
 * @field {number} a 默认为-0.0005
 * @field {number} b 默认为0.7237
 * @field {number} rho 公式：(A - A0 - a) / b，结果保留9位小数
 * @field {number} rho0 默认为0
 * @field {number} m 默认为2.5
 * @field {number} V 默认为25
 * @field {number} content 公式：(rho - rho0) * V * D / m / (1 - H2O * 0.01)
 * @field {number} contentRounded 结果保留小数点后2位,不超过3位有效数字
 */
interface IExcelData extends IApData {
  A0: number;
  a: number;
  b: number;
  rho?: number;
  rho0: number;
  m: number;
  V: number;
  content?: number;
  contentRounded?: number;
}

interface IProps {
  data: IApData[];
}
const ExcelPreview = ({ data }: IProps) => {
  const [excelData, setExcelData] = useState<IExcelData[]>([]);

  useEffect(() => {
    createExcelData(data);
  }, [data]);

  const createExcelData = (fillData: IApData[]) => {
    const newExcelData = [];
    for (let item of fillData) {
      const excelRow: IExcelData = {
        ...item,
        A0: 0,
        a: -0.0005,
        b: 0.7237,
        rho0: 0,
        m: 2.5,
        V: 25,
      };

      // 计算rho，(A - A0 - a) / b，保留9位小数
      const { A, A0, a, b } = excelRow;
      const rhoValue = new Decimal(A).minus(A0).minus(a).div(b).toFixed(9);
      excelRow.rho = Number(rhoValue);

      // 计算content， (rho - rho0) * V * D / m / (1 - H2O * 0.01)，保留4位小数
      const { rho, rho0, V, D, m, H2O } = excelRow;
      const part1 = new Decimal(rho).minus(rho0);
      const part2 = part1.times(V).times(D);
      const part3 = part2.div(m);
      const part4 = new Decimal(1).minus(new Decimal(H2O).times(0.01));
      const contentValue = part3.div(part4).toFixed(4);
      excelRow.content = Number(contentValue);

      // 计算contentRounded，结果保留小数点后2位，不超过3位有效数字
      excelRow.contentRounded = Number(
        new Decimal(excelRow.content).toPrecision(3)
      );

      // 保存一行
      newExcelData.push(excelRow);
    }

    setExcelData(newExcelData);
  };

  const exportToExcel = () => {
    // 创建一个工作簿
    const workbook = XLSX.utils.book_new();

    // 将数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 定义列头修改映射
    const headerMapping: { [key: string]: string } = {
      code: "编码",
      content: "含量mg/kg",
      contentRounded: "含量mg/kg",
    };

    // 获取列头行的范围
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    const firstRow = range.s.r;

    // 遍历列头并进行修改
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + (firstRow + 1);
      if (worksheet[address] && headerMapping[worksheet[address].v]) {
        worksheet[address].v = headerMapping[worksheet[address].v];
      }
    }

    // 设置列宽
    const colWidths = new Array(range.e.c + 1).fill({ wch: 12 }); // 设置每列宽度为20字符宽度
    worksheet["!cols"] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "有效磷");

    // 生成 Excel 文件并触发下载
    XLSX.writeFile(workbook, "化验结果.xlsx");
  };

  const columns: TableProps<IApData>["columns"] = [
    {
      title: "编号",
      dataIndex: "code",
      align: "center",
      width: 200,
    },
    {
      title: "A",
      dataIndex: "A",
      align: "center",
    },
    {
      title: "A0",
      dataIndex: "A0",
      align: "center",
    },
    {
      title: "a",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "b",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "ρ",
      dataIndex: "rho",
      align: "center",
    },
    {
      title: "ρ0",
      dataIndex: "rho0",
      align: "center",
    },
    {
      title: "m",
      dataIndex: "m",
      align: "center",
    },
    {
      title: "D",
      dataIndex: "D",
      align: "center",
    },
    {
      title: "V",
      dataIndex: "V",
      align: "center",
    },
    {
      title: "含量mg/kg",
      dataIndex: "content",
      align: "center",
    },
    {
      title: "含量(3位有效)",
      dataIndex: "contentRounded",
      align: "center",
    },
    {
      title: (
        <>
          H<sub>2</sub>O
        </>
      ),
      dataIndex: "H2O",
      align: "center",
    },
  ];
  return (
    <div>
      <Table
        style={{ marginTop: 20 }}
        rowKey={(row) => row.code}
        columns={columns}
        dataSource={excelData}
        pagination={{ position: [] }}
      />
      <div>
        <Button
          onClick={exportToExcel}
          type="primary"
          style={{ width: "100%" }}
        >
          导出Excel
        </Button>
      </div>
    </div>
  );
};

export default ExcelPreview;
