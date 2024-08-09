import { IWordTbData } from ".";
import {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Paragraph,
} from "docx";
import { saveAs } from "file-saver";

interface IProps {
  wordTbData: IWordTbData[];
}
const WordExport = ({ wordTbData }: IProps) => {
  // 处理导出按钮点击事件
  const handleExportClick = async (): Promise<void> => {
    // 创建表格行
    const rows: TableRow[] = [];

    // 添加表头行
    const headers = Object.keys(wordTbData[0]);
    rows.push(
      new TableRow({
        children: headers.map(
          (header) =>
            new TableCell({
              children: [new Paragraph(header)],
              width: { size: 20, type: WidthType.PERCENTAGE },
            })
        ),
      })
    );

    // 添加数据行
    wordTbData.forEach((item) => {
      const cells = headers.map(
        (header) =>
          new TableCell({
            children: [
              new Paragraph(String(item[header as keyof IWordTbData])),
            ],
            width: { size: 20, type: WidthType.PERCENTAGE },
          })
      );
      rows.push(new TableRow({ children: cells }));
    });

    // 创建表格
    const table = new Table({
      rows: rows,
    });

    // 创建文档
    const doc = new Document({
      sections: [
        {
          children: [table],
        },
      ],
    });

    // 将文档打包为Blob并触发下载
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "output.docx");
  };

  return <button onClick={handleExportClick}>导出为Word</button>;
};

export default WordExport;
