import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeoutException;

@RestController
public class ExportController {

    private final ExportManager exportManager;

    @Autowired
    public ExportController(ExportManager exportManager) {
        this.exportManager = exportManager;
    }

    /**
     * 订单导出接口
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param timeout 超时时间（秒）
     * @return 返回文件流
     */
    @GetMapping("/export/order")
    public ResponseEntity<byte[]> exportOrderData(@RequestParam String startDate, @RequestParam String endDate, @RequestParam long timeout) {
        try {
            // 创建订单导出任务
            ExportTask exportTask = new OrderExportTask(startDate, endDate);

            // 执行导出任务，设置超时
            ByteArrayOutputStream fileStream = exportManager.executeExportTask(exportTask, timeout);

            // 获取字节流
            byte[] fileBytes = fileStream.toByteArray();

            // 设置响应头，返回文件流
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=order_export.xlsx");
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (TimeoutException e) {
            // 超时错误返回
            return new ResponseEntity<>("现在导出任务过多，请稍后再试".getBytes(), HttpStatus.REQUEST_TIMEOUT);
        } catch (Exception e) {
            return new ResponseEntity<>("导出任务失败".getBytes(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 用户导出接口
     * @param timeout 超时时间（秒）
     * @return 返回文件流
     */
    @GetMapping("/export/user")
    public ResponseEntity<byte[]> exportUserData(@RequestParam long timeout) {
        try {
            // 创建用户导出任务
            ExportTask exportTask = new UserExportTask();

            // 执行导出任务，设置超时
            ByteArrayOutputStream fileStream = exportManager.executeExportTask(exportTask, timeout);

            // 获取字节流
            byte[] fileBytes = fileStream.toByteArray();

            // 设置响应头，返回文件流
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=user_export.xlsx");
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (TimeoutException e) {
            return new ResponseEntity<>("现在导出任务过多，请稍后再试".getBytes(), HttpStatus.REQUEST_TIMEOUT);
        } catch (Exception e) {
            return new ResponseEntity<>("导出任务失败".getBytes(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}