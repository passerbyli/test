chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id
  chrome.runtime.sendMessage({ type: 'getTabRecords', tabId }, (records) => {
    const xhrList = document.getElementById('xhrList')
    xhrList.innerHTML = records
      .map(
        (r) => `
        <div>
          <b>${r.method}</b> <code>${r.url}</code><br/>
          <b>Req:</b> <pre>${JSON.stringify(r.reqBody, null, 2)}</pre>
          <b>Status:</b> ${r.status || '-'}
          <hr/>
        </div>
      `
      )
      .join('')
  })
})
