const { get, set } = require('lodash')
const configStore = require('./configStore')

async function listSources() {
  return await configStore.getConfig('modules.datasource.sources', [])
}

async function addSource(newDs) {
  const sources = await listSources()
  sources.push(newDs)
  await configStore.setConfig('modules.datasource.sources', sources)
}

async function updateSource(id, newDs) {
  const sources = await listSources()
  const idx = sources.findIndex((ds) => ds.id === id)
  if (idx >= 0) {
    sources[idx] = { ...sources[idx], ...newDs }
    await configStore.setConfig('modules.datasource.sources', sources)
  }
}

async function deleteSource(id) {
  const sources = await listSources()
  const updated = sources.filter((ds) => ds.id !== id)
  await configStore.setConfig('modules.datasource.sources', updated)
}

async function setActiveSource(id) {
  await configStore.setConfig('modules.datasource.currentActiveId', id)
}

module.exports = {
  listSources,
  addSource,
  updateSource,
  deleteSource,
  setActiveSource,
}
