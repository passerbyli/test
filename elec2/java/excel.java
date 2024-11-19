import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Random;

// 数据实体类
public class ExportData {
    @ExcelProperty("标题")
    private String title;

    @ExcelProperty("上上年金额")
    private String twoYearAgoAmount;

    @ExcelProperty("去年金额")
    private String lastYearAmount;

    @ExcelProperty("今年金额")
    private String thisYearAmount;

    @ExcelProperty("访问量（PV）")
    private Integer pv;

    @ExcelProperty("同比增长率")
    private String rate;

    public ExportData(String title, String twoYearAgoAmount, String lastYearAmount, String thisYearAmount, Integer pv, String rate) {
        this.title = title;
        this.twoYearAgoAmount = twoYearAgoAmount;
        this.lastYearAmount = lastYearAmount;
        this.thisYearAmount = thisYearAmount;
        this.pv = pv;
        this.rate = rate;
    }

    // Getter 和 Setter 方法
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTwoYearAgoAmount() {
        return twoYearAgoAmount;
    }

    public void setTwoYearAgoAmount(String twoYearAgoAmount) {
        this.twoYearAgoAmount = twoYearAgoAmount;
    }

    public String getLastYearAmount() {
        return lastYearAmount;
    }

    public void setLastYearAmount(String lastYearAmount) {
        this.lastYearAmount = lastYearAmount;
    }

    public String getThisYearAmount() {
        return thisYearAmount;
    }

    public void setThisYearAmount(String thisYearAmount) {
        this.thisYearAmount = thisYearAmount;
    }

    public Integer getPv() {
        return pv;
    }

    public void setPv(Integer pv) {
        this.pv = pv;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }
}

// 主程序
public class ExportExcelExample {
    public static void main(String[] args) {
        // 获取当前年份
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);

        // 动态表头：年份替换
        List<List<String>> head = new ArrayList<>();
        head.add(List.of("标题"));
        head.add(List.of(String.valueOf(currentYear - 2) + " 金额"));
        head.add(List.of(String.valueOf(currentYear - 1) + " 金额"));
        head.add(List.of(String.valueOf(currentYear) + " 金额"));
        head.add(List.of("访问量（PV）"));
        head.add(List.of("同比增长率"));

        // 格式化工具
        DecimalFormat amountFormat = new DecimalFormat("#,###.00");
        DecimalFormat percentFormat = new DecimalFormat("0.00%");

        // 数据生成器
        Random random = new Random();
        List<ExportData> dataList = new ArrayList<>();
        for (int i = 0; i < 10; i++) { // 生成10条数据
            String title = "标题" + (i + 1);
            String twoYearAgoAmount = random.nextBoolean() ? amountFormat.format(random.nextDouble() * 1_000_000) : "--";
            String lastYearAmount = amountFormat.format(random.nextDouble() * 1_000_000);
            String thisYearAmount = amountFormat.format(random.nextDouble() * 1_000_000);
            int pv = random.nextInt(100_000);
            String rate = random.nextBoolean() ? percentFormat.format(random.nextDouble()) : "--";

            dataList.add(new ExportData(title, twoYearAgoAmount, lastYearAmount, thisYearAmount, pv, rate));
        }

        // 导出文件路径
        String filePath = "DynamicYearExportWithRandomData.xlsx";

        // 导出 Excel 文件
        EasyExcel.write(filePath, ExportData.class)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy()) // 自动调整列宽
                .sheet("数据报表")
                .doWrite(dataList);

        System.out.println("Excel 文件已导出: " + filePath);
    }
}