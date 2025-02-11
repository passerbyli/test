@Data
public class ExportRequest {
    private HashMap<String, Object> param;
    private int waitTime; // 每个任务的自定义等待时间（秒）
}