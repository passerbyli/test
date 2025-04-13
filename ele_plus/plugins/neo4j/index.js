const { exportNodes } = require('./exportNodes')
const { exportEdges } = require('./exportEdges')
const { runCypher, close } = require('./neo4j')
const fs = require('fs/promises')
const path = require('path')

async function main() {
  await exportNodes()
  await exportEdges()

  const nodes = await fs.readFile(path.join(__dirname, 'export/nodes.cypher'), 'utf8')
  const edges = await fs.readFile(path.join(__dirname, 'export/edges.cypher'), 'utf8')

  const cyphers = (nodes + '\n' + edges).split('\n').filter((line) => line.trim())

  for (const cypher of cyphers) {
    // await runCypher(cypher)
  }

  await close()
  console.log('PG 元数据 已同步至 Neo4j')
}

main()
