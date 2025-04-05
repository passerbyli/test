package com.macro.mall.tiny.exportPkg;

import com.alibaba.excel.EasyExcel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class ExportService {
    private static final Logger log = LoggerFactory.getLogger(ExportService.class);

    public void updateTaskStatus(String status, String taskId, String fileName, String message) {
        System.out.printf("任务 %s: 状态=%s, 文件=%s, 消息=%s%n", taskId, status, fileName, message);
    }

    /**
     * **生成 Excel 文件（异步）**
     */
    public void exportToFile(HttpServletRequest request, String taskId, String fileName,
                             HashMap<String, Object> param) {
        updateTaskStatus("执行中", taskId, fileName, "");

        try {
            File file = new File("exports/" + fileName);
            file.getParentFile().mkdirs();


            List<MyData> dataList = mockData();

            try (FileOutputStream out = new FileOutputStream(file)) {
                EasyExcel.write(out, MyData.class).sheet("Sheet1").doWrite(dataList);
            }

            updateTaskStatus("完成", taskId, fileName, "");
        } catch (Exception e) {
            updateTaskStatus("失败", taskId, fileName, e.getMessage());
        }
    }

    /**
     * **直接导出文件流（同步）**
     */
    public void exportToResponse(HttpServletRequest request, OutputStream outputStream,
                                 HashMap<String, Object> param) throws IOException {

        List<MyData> dataList = mockData();

        try {
            EasyExcel.write(outputStream, MyData.class).sheet("Sheet1").doWrite(dataList);

        } catch (Exception e) {
            log.error("Excel 导出失败", e);
            throw new RuntimeException("Excel 生成失败");
        }
    }

    private List<MyData> mockData() {
        List<MyData> dataList = new ArrayList<>();
        for (long i = 1; i <= 10; i++) {
            dataList.add(new MyData(i, "名称 " + i, LocalDateTime.now()));
        }
        return dataList;
    }
}