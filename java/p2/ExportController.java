@RestController
@RequestMapping("/export")
public class ExportController {

    @Resource
    private ExportTaskManager taskManager;

    @Resource
    private ExportService exportService;

    /**
     * 同步导出（直接下载文件）
     */
    @PostMapping("/download")
    public void download(HttpServletRequest request, HttpServletResponse response, @RequestBody HashMap<String, Object> param) throws Exception {
        boolean submitted = taskManager.submitTask(() -> {
            try {
                exportService.exportToResponse(request, response, param);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 0); // 不等待

        if (!submitted) {
            response.sendError(503, "导出任务过多，请稍后再试");
        }
    }

    /**
     * 创建异步导出任务
     */
    @PostMapping("/createTask")
    public ResultVO createTask(HttpServletRequest request, @RequestBody ExportRequest req) {
        String taskId = UUID.randomUUID().toString();
        String fileName = "export_" + taskId + ".xlsx";

        // 1️⃣ 记录任务初始化状态
        exportService.updateTaskStatus("初始化", taskId, fileName, "");

        // 2️⃣ 获取当前请求（存入线程上下文）
        HttpServletRequest requestContext = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        // 3️⃣ 启动异步任务，后台等待 `req.getWaitTime()` 秒
        CompletableFuture.runAsync(() -> {
            boolean submitted = taskManager.submitTask(() -> {
                exportService.exportToFile(requestContext, taskId, fileName, req.getParam());
            }, req.getWaitTime());

            if (!submitted) {
                exportService.updateTaskStatus("失败", taskId, fileName, "导出任务过多，请稍后再试");
            }
        });

        // 4️⃣ 立即返回任务创建成功
        return ResultVO.success("任务创建成功", taskId);
    }
}