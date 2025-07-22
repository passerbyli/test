export async function loadConfig() {
  return await window.configApi.getConfig()
}
export async function saveConfig(data) {
  // 自动结构化克隆安全转换
  const safeData = JSON.parse(JSON.stringify(data))
  return await window.configApi.updateConfig(safeData)
}
