document.getElementById("export-btn").addEventListener("click", async () => {
  try {
    const filePath = await window.electron.exportExcel();
    alert("Excel 导出成功，文件保存在：" + filePath);
  } catch (error) {
    console.error("导出失败:", error);
    alert("导出失败");
  }
});
