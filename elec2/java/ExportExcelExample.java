import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class ExportExcelExample {

    public static void main(String[] args) {
        // 模拟参数：可以设置为 "amount" 或 "count"
        String type = "amount"; // 改为 "count" 测试数量导出

        // 获取当前年份
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);

        // 动态表头
        List<List<String>> head = new ArrayList<>();
        head.add(List.of("标题"));
        if ("amount".equalsIgnoreCase(type)) {
            head.add(List.of(String.valueOf(currentYear - 2) + " 金额"));
            head.add(List.of(String.valueOf(currentYear - 1) + " 金额"));
            head.add(List.of(String.valueOf(currentYear) + " 金额"));
        } else if ("count".equalsIgnoreCase(type)) {
            head.add(List.of(String.valueOf(currentYear - 2) + " 数量"));
            head.add(List.of(String.valueOf(currentYear - 1) + " 数量"));
            head.add(List.of(String.valueOf(currentYear) + " 数量"));
        }

        // 模拟数据库数据
        List<WideTableEntity> dbData = new ArrayList<>();
        dbData.add(createEntity("标题1", 123456.12, 11124.33, 3212341.56, 123, 345223, 39101, 13212, 0.234));
        dbData.add(createEntity("标题2", 65432.78, 9876.54, null, null, 0, 39101, 12003, null));

        // 数据格式化和映射
        List<ExportData> dataList = new ArrayList<>();
        DecimalFormat amountFormat = new DecimalFormat("#,###.00");
        for (WideTableEntity entity : dbData) {
            String title = entity.getTitle();
            if ("amount".equalsIgnoreCase(type)) {
                dataList.add(new ExportData(
                        title,
                        formatValue(entity.getTwoYearAgoAmount(), amountFormat),
                        formatValue(entity.getLastYearAmount(), amountFormat),
                        formatValue(entity.getThisYearAmount(), amountFormat)
                ));
            } else if ("count".equalsIgnoreCase(type)) {
                dataList.add(new ExportData(
                        title,
                        formatValue(entity.getTwoYearAgoCount(), null),
                        formatValue(entity.getLastYearCount(), null),
                        formatValue(entity.getThisYearCount(), null)
                ));
            }
        }

        // 导出路径
        String filePath = "DynamicExportFromDatabase.xlsx";

        // 使用 EasyExcel 导出
        EasyExcel.write(filePath, ExportData.class)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy()) // 自动调整列宽
                .head(head)
                .sheet("数据报表")
                .doWrite(dataList);

        System.out.println("Excel 文件已导出: " + filePath);
    }

    // 创建模拟数据
    private static WideTableEntity createEntity(String title, Double thisYearAmount, Double lastYearAmount, Double twoYearAgoAmount,
                                                Integer thisYearCount, Integer lastYearCount, Integer twoYearAgoCount,
                                                Integer pv, Double rate) {
        WideTableEntity entity = new WideTableEntity();
        entity.setTitle(title);
        entity.setThisYearAmount(thisYearAmount);
        entity.setLastYearAmount(lastYearAmount);
        entity.setTwoYearAgoAmount(twoYearAgoAmount);
        entity.setThisYearCount(thisYearCount);
        entity.setLastYearCount(lastYearCount);
        entity.setTwoYearAgoCount(twoYearAgoCount);
        entity.setPv(pv);
        entity.setRate(rate);
        return entity;
    }

    // 格式化字段值
    private static String formatValue(Object value, DecimalFormat format) {
        if (value == null) {
            return "--";
        }
        if (format != null && value instanceof Number) {
            return format.format(value);
        }
        return value.toString();
    }
}