function simpleHtmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n') // 转换换行
    .replace(/<[^>]+>/g, '') // 去除所有标签
    .replace(/\n{2,}/g, '\n') // 清理多余换行
    .trim()
}
