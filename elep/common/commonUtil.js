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
      let cmp = 0;

      // ① 自定义顺序逻辑
      if (Array.isArray(customOrder)) {
        const idxA = customOrder.indexOf(a[key]);
        const idxB = customOrder.indexOf(b[key]);
        const rankA = idxA === -1 ? customOrder.length : idxA;
        const rankB = idxB === -1 ? customOrder.length : idxB;
        cmp = rankA - rankB;
      } else {
        // ② 默认比较（字符串/数字自动兼容）
        if (a[key] < b[key]) cmp = -1;
        else if (a[key] > b[key]) cmp = 1;
        else cmp = 0;
      }

      // 若当前字段已分出大小，按 asc/desc 返回
      if (cmp !== 0) return order === 'desc' ? -cmp : cmp;
      // 否则继续比较下一字段
    }
    return 0; // 所有字段都相等
  });
}

const commonUtils = { simpleHtmlToText }

// CommonJS 导出（Node.js / Electron 主进程使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = commonUtils
}

// ESM 导出（Vue / 前端使用）
export default commonUtils
export { simpleHtmlToText }




/////

// read-components.js
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

/**
 * 读取 component 目录下各子文件夹的 JSON 配置
 * @param {string} componentDir 组件根目录（绝对或相对路径）
 * @returns {Promise<Array<Object>>}
 */
export async function readComponentConfigs(componentDir = './component') {
  // 1. 列出 component 下所有条目
  const entries = await readdir(componentDir, { withFileTypes: true });

  // 2. 仅保留目录
  const folders = entries.filter(e => e.isDirectory());

  // 3. 并行读取每个目录里的 .json 文件
  const configs = await Promise.all(
    folders.map(async (dirEnt) => {
      const folderName = dirEnt.name;
      const folderPath = path.join(componentDir, folderName);

      // 默认约定：json 文件名与文件夹同名（如 folder1/folder1.json）
      const jsonPath = path.join(folderPath, `${folderName}.json`);

      try {
        // 先确认文件存在再读取（可选）
        await stat(jsonPath);

        // 读取并解析 JSON
        const raw = await readFile(jsonPath, 'utf-8');
        const json = JSON.parse(raw);

        // 返回合并后的对象：folderName + json 所有字段
        return { folderName, ...json };
      } catch (err) {
        console.warn(`⚠️  跳过 ${jsonPath}：${err.message}`);
        return null;               // 若缺文件或解析失败则忽略
      }
    })
  );

  // 4. 过滤掉为空的项
  return configs.filter(Boolean);
}

// ◆ 示例调用
if (import.meta.url === `file://${process.argv[1]}`) {
  readComponentConfigs('./component')
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(console.error);
}