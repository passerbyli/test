import java.io.ByteArrayOutputStream;

public class UserExportTask implements ExportTask {
    @Override
    public ByteArrayOutputStream executeExport() throws Exception {
        // 处理用户导出逻辑
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        // 假设我们使用 Excel 导出工具，这里是伪代码
        // exportService.exportUsers(outputStream);
        return outputStream;
    }
}