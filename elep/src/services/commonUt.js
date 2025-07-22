function simpleHtmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n') // 转换换行
    .replace(/<[^>]+>/g, '') // 去除所有标签
    .replace(/(【[^】]+】)/g, '\n$1\n') // 在【xxx】前后加换行
    .replace(/\n{2,}/g, '\n') // 清理多余换行
    .trim()
}

/**
 * 通用多字段排序
 * @param {Array<Object>} list         原数组
 * @param {Array<Object>} rules        排序规则数组，顺序即优先级高→低
 *   - key        要比较的字段名
 *   - order      'asc' | 'desc'（默认 asc）
 *   - customOrder 可选，自定义优先级数组，例如 ['c','b']
 * @returns {Array<Object>}            新排序后的数组
 */
function multiFieldSort(list, rules) {
  // 复制一份，保证不改动原数组
  return [...list].sort((a, b) => {
    for (const { key, order = 'asc', customOrder } of rules) {
      let cmp = 0

      // ① 自定义顺序逻辑
      if (Array.isArray(customOrder)) {
        const idxA = customOrder.indexOf(a[key])
        const idxB = customOrder.indexOf(b[key])
        const rankA = idxA === -1 ? customOrder.length : idxA
        const rankB = idxB === -1 ? customOrder.length : idxB
        cmp = rankA - rankB
      } else {
        // ② 默认比较（字符串/数字自动兼容）
        if (a[key] < b[key]) cmp = -1
        else if (a[key] > b[key]) cmp = 1
        else cmp = 0
      }

      // 若当前字段已分出大小，按 asc/desc 返回
      if (cmp !== 0) return order === 'desc' ? -cmp : cmp
      // 否则继续比较下一字段
    }
    return 0 // 所有字段都相等
  })
}

const commonUtils = { simpleHtmlToText, multiFieldSort }

// CommonJS 导出（Node.js / Electron 主进程使用）
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = commonUtils
// }

// ESM 导出（Vue / 前端使用）
export default commonUtils
