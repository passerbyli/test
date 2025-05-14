export async function listSources() {
  return await window.dsApi.list()
}

export async function saveSources(data) {
  return await window.dsApi.save(JSON.parse(JSON.stringify(data)))
}

export async function testSource(ds) {
  return await window.dsApi.test(JSON.parse(JSON.stringify(ds)))
}
