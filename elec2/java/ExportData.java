import com.alibaba.excel.annotation.ExcelProperty;

public class ExportData {
    @ExcelProperty("标题")
    private String title;

    @ExcelProperty("上上年")
    private String twoYearAgo;

    @ExcelProperty("去年")
    private String lastYear;

    @ExcelProperty("今年")
    private String thisYear;

    public ExportData(String title, String twoYearAgo, String lastYear, String thisYear) {
        this.title = title;
        this.twoYearAgo = twoYearAgo;
        this.lastYear = lastYear;
        this.thisYear = thisYear;
    }

    // Getter 和 Setter
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTwoYearAgo() {
        return twoYearAgo;
    }

    public void setTwoYearAgo(String twoYearAgo) {
        this.twoYearAgo = twoYearAgo;
    }

    public String getLastYear() {
        return lastYear;
    }

    public void setLastYear(String lastYear) {
        this.lastYear = lastYear;
    }

    public String getThisYear() {
        return thisYear;
    }

    public void setThisYear(String thisYear) {
        this.thisYear = thisYear;
    }
}