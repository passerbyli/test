import fs from 'fs'
import path from 'path'
// import { app } from 'electron'

// const configPath = path.join(app.getPath('userData'), 'config.json')

export async function readConfig() {
  try {
    const raw = {} //fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeConfig(config) {
  //   fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
}
