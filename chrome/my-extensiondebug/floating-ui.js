// ;(function () {
//   function createPanel() {
//     if (document.getElementById('floating-request-log')) return

//     const panel = document.createElement('div')
//     panel.id = 'floating-request-log'
//     document.body.appendChild(panel)

//     window.addEventListener('FLOATING_LOG_EVENT', (e) => {
//       const log = e.detail
//       const line = document.createElement('div')
//       line.textContent = `[${log.method}] ${log.url} → ${log.status} (${log.duration}ms)`
//       panel.appendChild(line)
//       if (panel.childNodes.length > 200) panel.removeChild(panel.firstChild)
//       panel.scrollTop = panel.scrollHeight
//     })
//   }

//   if (document.body) {
//     createPanel()
//   } else {
//     window.addEventListener('DOMContentLoaded', createPanel)
//   }
// })()

// floating-ui.js 调试增强版
(function () {
  function createFloatingIcon() {
    if (document.getElementById('floating-request-icon')) return;

    console.log('[XHR Logger] Inserting floating icon');

    const icon = document.createElement('div');
    icon.id = 'floating-request-icon';
    icon.textContent = '📊';
    icon.style.cssText = `
      position: fixed;
      left: 10px;
      top: 100px;
      width: 36px;
      height: 36px;
      background: #333;
      color: #fff;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      z-index: 99999;
      border-radius: 18px;
      user-select: none;
    `;

    let offsetY = 0;
    let dragging = false;

    icon.addEventListener('mousedown', (e) => {
      dragging = true;
      offsetY = e.clientY - icon.getBoundingClientRect().top;
      icon.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      icon.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
      icon.style.cursor = 'grab';
    });

    icon.addEventListener('click', () => {
      console.log('[XHR Logger] Floating icon clicked');
      const panel = document.getElementById('floating-request-panel');
      if (panel) {
        console.log('[XHR Logger] Panel exists. Removing.');
        panel.remove();
      } else {
        console.log('[XHR Logger] Creating panel');
        createPanel();
      }
    });

    document.body.appendChild(icon);
  }

  function createPanel() {
    console.log('[XHR Logger] createPanel invoked');

    const panel = document.createElement('div');
    panel.id = 'floating-request-panel';
    panel.style.cssText = `
      position: fixed;
      left: 50px;
      top: 100px;
      width: 480px;
      max-height: 300px;
      background: #1e1e1e;
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
      overflow-y: auto;
      z-index: 99998;
    `;

    const closeBtn = document.createElement('div');
    closeBtn.textContent = '✖';
    closeBtn.style.cssText = `
      position: absolute;
      top: 6px;
      right: 10px;
      cursor: pointer;
      font-size: 14px;
    `;
    closeBtn.onclick = () => {
      console.log('[XHR Logger] Close button clicked');
      panel.remove();
    };
    panel.appendChild(closeBtn);

    const title = document.createElement('div');
    title.textContent = '请求统计信息';
    title.style.cssText = 'margin-bottom: 8px; font-weight: bold;';
    panel.appendChild(title);

    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; border-collapse: collapse;';
    panel.appendChild(table);

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr style="border-bottom: 1px solid #666;"><th align="left">方法</th><th align="left">状态</th><th align="left">URL</th></tr>';
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const renderRow = (log) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${log.method}</td><td>${log.status}</td><td style="overflow-wrap:anywhere">${log.url}</td>`;
      tbody.appendChild(row);
      if (tbody.childNodes.length > 50) tbody.removeChild(tbody.firstChild);
    };

    window.addEventListener('FLOATING_LOG_EVENT', (e) => {
      console.log('[XHR Logger] Received FLOATING_LOG_EVENT', e.detail);
      renderRow(e.detail);
    });

    document.body.appendChild(panel);
  }

  if (document.body) {
    createFloatingIcon();
  } else {
    window.addEventListener('DOMContentLoaded', createFloatingIcon);
  }
})();
