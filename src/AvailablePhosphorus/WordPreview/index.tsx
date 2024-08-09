import { useEffect, useState } from "react";
import { IExcelData } from "../ExcelPreview";
import WordExport from "./WordExport";
import notoSansSCRegular from "./NotoSansSC-VariableFont_wght.ttf";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

// 注册支持中文的字体
Font.register({
  family: "Noto Sans SC",
  src: notoSansSCRegular,
});

export interface IWordTbData {
  code: string;
  A: number;
  H2O: number;
  D: number;
  contentRounded?: number;
}

interface IProps {
  sampleName: string;
  excelData: IExcelData[];
}
const WordPreview = ({ sampleName, excelData }: IProps) => {
  const [wordTbData, setWordTbData] = useState<IWordTbData[]>([]);

  useEffect(() => {
    createWordTbData();
  }, [excelData]);

  const createWordTbData = () => {
    const newData: IWordTbData[] = [];
    for (let item of excelData) {
      const { code, H2O, D, A, contentRounded } = item;
      newData.push({ code, H2O, D, A, contentRounded });
    }
    setWordTbData(newData);
  };

  // 定义样式
  const styles = StyleSheet.create({
    body: {
      padding: 20,
      fontFamily: "Noto Sans SC", // 使用注册的中文字体
    },
    title: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
    },
    subtitleContainer: {
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 12,
      marginBottom: 4,
      lineHeight: 1.5,
    },
    table: {
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderColor: "#bfbfbf",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      flex: 1,
      borderStyle: "solid",
      borderColor: "#bfbfbf",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 5,
    },
    tableCell: {
      fontSize: 10,
      textAlign: "center",
    },
  });

  // 定义文档结构
  const MyDocument = () => (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.subtitle}>HJ/JL-058-2023 E/0</Text>

        {/* 标题 */}
        <Text style={styles.title}>分光光度法（土壤）分析原始记录</Text>

        {/* 副标题部分 */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>样品名称： {sampleName}</Text>
          <Text style={styles.subtitle}>分析项目： 有效磷</Text>
          <Text style={styles.subtitle}>
            方法依据：
            《第三次全国土壤普查样品制备与检测培训教材》第三章第二十五节
            第二法碳酸氢钠浸提-钼锑抗比色法
          </Text>
          <Text style={styles.subtitle}>测定日期：2024.03.09</Text>
          <Text style={styles.subtitle}>
            仪器名称及型号： 紫外可见分光光度计754
          </Text>
          <Text style={styles.subtitle}>仪器编号： 10056</Text>
          <Text style={styles.subtitle}>检定/校准到期时间： 2024.06.05</Text>
          <Text style={styles.subtitle}>
            实验室条件： 温度： 25℃ 湿度： 45％
          </Text>
          <Text style={styles.subtitle}>采用波长： 880nm</Text>
          <Text style={styles.subtitle}>比色皿厚度： 1cm</Text>
          <Text style={styles.subtitle}>参比溶液： 标准溶液零点</Text>
        </View>

        {/* 表格 */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>检测结果</Text>
            </View>
          </View>

          {/* 表头 */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>样品编号</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>样品吸光度 A</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>ωH2O （％）</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>分取 倍数 D</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>含量 （mg/kg）</Text>
            </View>
          </View>
          {/* 数据行 */}
          {wordTbData.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.code}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.A}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.H2O}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.D}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.contentRounded}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PDFViewer width="900" height="600">
          <MyDocument />
        </PDFViewer>
      </div>

      <WordExport wordTbData={wordTbData} />
    </div>
  );
};

export default WordPreview;
