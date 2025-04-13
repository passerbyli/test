const fs = require('fs/promises')
const path = require('path')
const { query } = require('./db')

async function exportNodes() {
  const cypherList = []

  const schemas = await query('SELECT * FROM ads_dl.metadata_schema')
  schemas.forEach((item) => {
    cypherList.push(
      `MERGE (:Schema {name:'${item.name}', description:'${item.description || ''}'})`,
    )
  })

  const tables = await query('SELECT * FROM ads_dl.metadata_table')
  tables.forEach((item) => {
    cypherList.push(
      `MERGE (t:Table {name:'${item.schema_name}.${item.name}', description:'${item.description || ''}', layer:'${item.layer}', type:'${item.type}'});`,
    )
    // cypherList.push(
    //   `MATCH (t:Table {name:'${item.schema_name}.${item.name}'}), (s:Schema {name:'${item.schema_name}'}) MERGE (t)-[:BELONGS_TO]->(s);`,
    // )
  })

  await fs.writeFile(path.join(__dirname, 'export/nodes.cypher'), cypherList.join('\n'))
}

module.exports = { exportNodes }
