import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;

public class WideTableEntity {

    @ExcelProperty("标题")
    private String title;

    @ExcelIgnore
    private Double thisYearAmount;

    @ExcelIgnore
    private Double lastYearAmount;

    @ExcelIgnore
    private Double twoYearAgoAmount;

    @ExcelIgnore
    private Integer thisYearCount;

    @ExcelIgnore
    private Integer lastYearCount;

    @ExcelIgnore
    private Integer twoYearAgoCount;

    @ExcelIgnore
    private Integer count;

    @ExcelIgnore
    private Integer pv;

    @ExcelIgnore
    private Double rate;

    // Getter 和 Setter
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getThisYearAmount() {
        return thisYearAmount;
    }

    public void setThisYearAmount(Double thisYearAmount) {
        this.thisYearAmount = thisYearAmount;
    }

    public Double getLastYearAmount() {
        return lastYearAmount;
    }

    public void setLastYearAmount(Double lastYearAmount) {
        this.lastYearAmount = lastYearAmount;
    }

    public Double getTwoYearAgoAmount() {
        return twoYearAgoAmount;
    }

    public void setTwoYearAgoAmount(Double twoYearAgoAmount) {
        this.twoYearAgoAmount = twoYearAgoAmount;
    }

    public Integer getThisYearCount() {
        return thisYearCount;
    }

    public void setThisYearCount(Integer thisYearCount) {
        this.thisYearCount = thisYearCount;
    }

    public Integer getLastYearCount() {
        return lastYearCount;
    }

    public void setLastYearCount(Integer lastYearCount) {
        this.lastYearCount = lastYearCount;
    }

    public Integer getTwoYearAgoCount() {
        return twoYearAgoCount;
    }

    public void setTwoYearAgoCount(Integer twoYearAgoCount) {
        this.twoYearAgoCount = twoYearAgoCount;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getPv() {
        return pv;
    }

    public void setPv(Integer pv) {
        this.pv = pv;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }
}