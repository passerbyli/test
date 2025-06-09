public static string SanitizeForCsv(string input)
{
    if (string.IsNullOrWhiteSpace(input)) return input;
    char firstChar = input[0];
    if (firstChar == '=' || firstChar == '+' || firstChar == '-' || firstChar == '@')
    {
        return "'" + input;
    }
    return input;
}


using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.Collections.Generic;
using System.IO;

public static void ExportToXlsx(List<string> headers, List<List<string>> data, string filePath)
{
    IWorkbook workbook = new XSSFWorkbook();
    ISheet sheet = workbook.CreateSheet("Sheet1");

    // 写标题
    IRow headerRow = sheet.CreateRow(0);
    for (int i = 0; i < headers.Count; i++)
    {
        ICell cell = headerRow.CreateCell(i);
        cell.SetCellValue(headers[i]);
    }

    // 写内容
    for (int i = 0; i < data.Count; i++)
    {
        IRow row = sheet.CreateRow(i + 1);
        for (int j = 0; j < data[i].Count; j++)
        {
            string sanitizedValue = SanitizeForCsv(data[i][j]);
            ICell cell = row.CreateCell(j);
            cell.SetCellValue(sanitizedValue);
        }
    }

    using (var fs = new FileStream(filePath, FileMode.Create, FileAccess.Write))
    {
        workbook.Write(fs);
    }
}


using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

public static void ExportToCsv(List<string> headers, List<List<string>> data, string filePath)
{
    using (var writer = new StreamWriter(filePath, false, Encoding.UTF8))
    {
        // 写入标题
        var headerLine = string.Join(",", headers.Select(h => $"\"{h.Replace("\"", "\"\"")}\""));
        writer.WriteLine(headerLine);

        // 写入数据
        foreach (var row in data)
        {
            var sanitizedRow = row.Select(value => SanitizeForCsv(value));
            var line = string.Join(",", sanitizedRow.Select(v => $"\"{v.Replace("\"", "\"\"")}\""));
            writer.WriteLine(line);
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

class ExcelExporter
{
    // 用于 CSV 注入防护的清洗方法
    public static string SanitizeForCsv(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        char first = input[0];
        if (first == '=' || first == '+' || first == '-' || first == '@')
        {
            return "'" + input;
        }
        return input;
    }

    // 导出 xlsx 文件（设置文本格式）
    public static void ExportToXlsx(List<List<string>> data, string filePath)
    {
        IWorkbook workbook = new XSSFWorkbook();
        ISheet sheet = workbook.CreateSheet("Sheet1");

        ICellStyle textStyle = workbook.CreateCellStyle();
        IDataFormat dataFormat = workbook.CreateDataFormat();
        textStyle.DataFormat = dataFormat.GetFormat("@"); // 设置为文本格式

        for (int i = 0; i < data.Count; i++)
        {
            IRow row = sheet.CreateRow(i);
            for (int j = 0; j < data[i].Count; j++)
            {
                ICell cell = row.CreateCell(j);
                cell.CellStyle = textStyle;
                cell.SetCellValue(data[i][j]);
            }
        }

        using (FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.Write))
        {
            workbook.Write(fs);
        }

        Console.WriteLine($"✅ 已导出 XLSX 至：{filePath}");
    }

    // 导出 csv 文件（转义危险字符）
    public static void ExportToCsv(List<List<string>> data, string filePath)
    {
        using (var writer = new StreamWriter(filePath, false, Encoding.UTF8))
        {
            foreach (var row in data)
            {
                var safeRow = row.Select(SanitizeForCsv)
                                 .Select(v => $"\"{v.Replace("\"", "\"\"")}\""); // 双引号转义
                writer.WriteLine(string.Join(",", safeRow));
            }
        }

        Console.WriteLine($"✅ 已导出 CSV 至：{filePath}");
    }

    // 示例入口
    public static void Main()
    {
        var data = new List<List<string>> {
            new List<string> { "Name", "Email", "Comment" },
            new List<string> { "Alice", "alice@example.com", "=cmd|' /C calc'!A0" },
            new List<string> { "Bob", "bob@example.com", "+malicious_code()" },
            new List<string> { "Charlie", "charlie@example.com", "Normal text" }
        };

        ExportToXlsx(data, "output.xlsx");
        ExportToCsv(data, "output.csv");
    }
}