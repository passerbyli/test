import { getConfig, setConfig } from './configStore'

export async function getAllSources() {
  return await getConfig('modules.datasource.sources', [])
}

export async function getActiveSourceId() {
  return await getConfig('modules.datasource.currentActiveId', '')
}

export async function addOrUpdateSource(newDs) {
  const sources = await getAllSources()
  const idx = sources.findIndex((ds) => ds.id === newDs.id)
  if (idx >= 0) sources[idx] = newDs
  else sources.push(newDs)
  await setConfig('modules.datasource.sources', sources)
}

export async function deleteSource(id) {
  const sources = await getAllSources()
  await setConfig(
    'modules.datasource.sources',
    sources.filter((ds) => ds.id !== id),
  )
}

export async function setActiveSource(id) {
  await setConfig('modules.datasource.currentActiveId', id)
}
