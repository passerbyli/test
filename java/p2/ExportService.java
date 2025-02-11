@Service
public class ExportService {

    public void updateTaskStatus(String status, String taskId, String fileName, String message) {
        System.out.printf("任务 %s: 状态=%s, 文件=%s, 消息=%s%n", taskId, status, fileName, message);
    }

    /**
     * 生成 Excel 文件（异步）
     */
    public void exportToFile(HttpServletRequest request, String taskId, String fileName, HashMap<String, Object> param) {
        updateTaskStatus("执行中", taskId, fileName, "");

        try {
            File file = new File("exports/" + fileName);
            file.getParentFile().mkdirs();

            List<ExportData> dataList = getMockData();

            try (FileOutputStream out = new FileOutputStream(file)) {
                EasyExcel.write(out, ExportData.class)
                        .sheet("Sheet1")
                        .doWrite(dataList);
            }

            updateTaskStatus("完成", taskId, fileName, "");
        } catch (Exception e) {
            updateTaskStatus("失败", taskId, fileName, e.getMessage());
        }
    }

    /**
     * 直接导出文件流（同步）
     */
    public void exportToResponse(HttpServletRequest request, HttpServletResponse response, HashMap<String, Object> param) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=export.xlsx");

        List<ExportData> dataList = getMockData();

        EasyExcel.write(response.getOutputStream(), ExportData.class)
                .sheet("Sheet1")
                .doWrite(dataList);
    }

    private List<ExportData> getMockData() {
        List<ExportData> list = new ArrayList<>();
        for (int i = 1; i <= 1000; i++) {
            list.add(new ExportData(i, "用户_" + i, new Date()));
        }
        return list;
    }
}