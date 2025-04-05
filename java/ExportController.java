package com.macro.mall.tiny.exportPkg;

import com.macro.mall.tiny.common.api.CommonResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Controller
@RequestMapping("/export")
public class ExportController {
    private static final Logger log = LoggerFactory.getLogger(ExportController.class);

    @Autowired
    private ExportTaskManager exportTaskManager;

    @Resource
    private ExportService exportService;


    /**
     * **同步导出（直接下载文件）**
     * - 没有等待逻辑，直接返回 Excel 文件流
     * - 如果线程池满，则返回 503 错误
     */
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    @ResponseBody
    public void download(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, Object> param = new HashMap<>();
// 提交到 ExportTaskManager 的线程池中同步执行


        TaskStatusVO taskStatusVO = exportTaskManager.submitTask(() -> {
            try {
                response.setContentType("application/vnd.ms-excel");
                response.setHeader("Content-Disposition", "attachment; filename=\"export.xlsx\"");
                exportService.exportToResponse(request, response.getOutputStream(), param);
            } catch (IOException e) {
                log.error("任务执行失败：{}", e.getMessage(), e);
                throw new RuntimeException("导出失败");
            }
        }, 30); // 超时时间 30 秒

        if (!taskStatusVO.getStatus()) {
            response.reset(); // 重置响应内容
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try {
                response.getWriter().write("导出任务超时或失败，请稍后重试" + taskStatusVO.getStatusCode());
            } catch (IOException e) {
                log.error("写入错误信息失败：{},{}", e.getMessage(), taskStatusVO.getStatusCode());
            }
        }
    }


    /**
     * **创建异步导出任务**
     * - 立即返回任务 ID，不阻塞主线程
     * - 任务进入 `taskManager`，最多等待 `req.getWaitTime()` 秒
     * - 任务超时后自动失败
     */
    @RequestMapping(value = "/createTask", method = RequestMethod.GET)
    @ResponseBody
    public CommonResult createTask() {
        String taskId = UUID.randomUUID().toString();
        String fileName = "export_" + taskId + ".xlsx";
        // 1️⃣ 记录任务初始化状态
        exportService.updateTaskStatus("初始化", taskId, fileName, "");

        // 2️⃣ 获取当前 HTTP 请求（存入线程上下文）
        HttpServletRequest requestContext =
                ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        // 3️⃣ 启动异步任务，后台等待 `req.getWaitTime()` 秒
        CompletableFuture.runAsync(() -> {

            TaskStatusVO submitted = exportTaskManager.submitTask(() -> {
                exportService.exportToFile(requestContext, taskId, fileName, new HashMap<>());
            }, 30);

            if (!submitted.getStatus()) {
                exportService.updateTaskStatus("失败", taskId, fileName, "导出任务过多，请稍后再试" + submitted.getStatusCode());
            }
        });

        // 4️⃣ 立即返回任务创建成功
        return CommonResult.success("任务创建成功");
    }
}
