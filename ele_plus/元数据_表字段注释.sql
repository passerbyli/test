COMMENT ON TABLE data_source IS '数据源表：记录系统中接入的所有原始数据来源，如 MySQL、API、PGSQL 等。';
COMMENT ON COLUMN data_source.uuid IS '主键 UUID，全局唯一';
COMMENT ON COLUMN data_source.name IS '数据源名称';
COMMENT ON COLUMN data_source.type IS '数据源类型（如 mysql、pgsql、api、mqs）';
COMMENT ON COLUMN data_source.config IS '连接配置 JSON（含主机、端口、认证等）';
COMMENT ON COLUMN data_source.description IS '数据源描述';
COMMENT ON COLUMN data_source.is_manual IS '是否人工创建';
COMMENT ON COLUMN data_source.created_at IS '创建时间';




COMMENT ON TABLE schema_metadata IS 'Schema 表：记录每个数据源下的逻辑库（Schema）信息。';
COMMENT ON COLUMN schema_metadata.uuid IS '主键 UUID';
COMMENT ON COLUMN schema_metadata.name IS 'Schema 名称';
COMMENT ON COLUMN schema_metadata.data_source_uuid IS '所属数据源 UUID';
COMMENT ON COLUMN schema_metadata.description IS '描述';
COMMENT ON COLUMN schema_metadata.is_manual IS '是否人工创建';
COMMENT ON COLUMN schema_metadata.created_at IS '创建时间';



COMMENT ON TABLE table_metadata IS '表元数据：记录系统中的所有表、视图、中间表信息。';
COMMENT ON COLUMN table_metadata.uuid IS '主键 UUID';
COMMENT ON COLUMN table_metadata.name IS '表名';
COMMENT ON COLUMN table_metadata.schema_uuid IS '所属 Schema UUID';
COMMENT ON COLUMN table_metadata.layer IS '所属分层（如 ods、dwd、dws、ads）';
COMMENT ON COLUMN table_metadata.type IS '表类型（table、view、tmp）';
COMMENT ON COLUMN table_metadata.description IS '表说明';
COMMENT ON COLUMN table_metadata.is_manual IS '是否人工添加';
COMMENT ON COLUMN table_metadata.created_at IS '创建时间';




COMMENT ON TABLE column_metadata IS '字段元数据表：记录每个字段的名称、类型等信息。';
COMMENT ON COLUMN column_metadata.uuid IS '主键 UUID';
COMMENT ON COLUMN column_metadata.table_uuid IS '所属表 UUID';
COMMENT ON COLUMN column_metadata.name IS '字段名';
COMMENT ON COLUMN column_metadata.type IS '字段类型';
COMMENT ON COLUMN column_metadata.is_pk IS '是否主键';
COMMENT ON COLUMN column_metadata.description IS '字段说明';
COMMENT ON COLUMN column_metadata.is_manual IS '是否人工添加';
COMMENT ON COLUMN column_metadata.created_at IS '创建时间';



COMMENT ON TABLE schedule_platform IS '调度平台：记录不同的调度系统，如 Airflow、Azkaban、自研等。';
COMMENT ON COLUMN schedule_platform.uuid IS '主键 UUID';
COMMENT ON COLUMN schedule_platform.name IS '平台名称';
COMMENT ON COLUMN schedule_platform.description IS '平台描述';
COMMENT ON COLUMN schedule_platform.created_at IS '创建时间';



COMMENT ON TABLE schedule_task IS '调度任务：记录每个平台下的具体调度任务定义。';
COMMENT ON COLUMN schedule_task.uuid IS '主键 UUID';
COMMENT ON COLUMN schedule_task.name IS '任务名称';
COMMENT ON COLUMN schedule_task.platform_uuid IS '所属调度平台 UUID';
COMMENT ON COLUMN schedule_task.cron IS '调度周期表达式';
COMMENT ON COLUMN schedule_task.type IS '任务类型（sql/stored_proc/api）';
COMMENT ON COLUMN schedule_task.description IS '任务描述';
COMMENT ON COLUMN schedule_task.is_manual IS '是否人工创建';
COMMENT ON COLUMN schedule_task.created_at IS '创建时间';




COMMENT ON TABLE schedule_sub_task IS '调度子任务：记录调度任务中的子步骤（用于 DAG 节点定义）。';
COMMENT ON COLUMN schedule_sub_task.uuid IS '主键 UUID';
COMMENT ON COLUMN schedule_sub_task.task_uuid IS '所属调度任务 UUID';
COMMENT ON COLUMN schedule_sub_task.name IS '子任务名称';
COMMENT ON COLUMN schedule_sub_task.sequence IS '执行顺序';
COMMENT ON COLUMN schedule_sub_task.script_uuid IS '对应执行脚本 UUID';
COMMENT ON COLUMN schedule_sub_task.output_table_uuid IS '产出表 UUID';
COMMENT ON COLUMN schedule_sub_task.is_manual IS '是否人工创建';
COMMENT ON COLUMN schedule_sub_task.created_at IS '创建时间';




COMMENT ON TABLE script IS '脚本定义表：记录 SQL 脚本、存储过程内容。';
COMMENT ON COLUMN script.uuid IS '主键 UUID';
COMMENT ON COLUMN script.name IS '脚本名称';
COMMENT ON COLUMN script.type IS '脚本类型（sql/stored_proc/api）';
COMMENT ON COLUMN script.content IS '脚本/过程内容';
COMMENT ON COLUMN script.parsed IS '是否已解析依赖';
COMMENT ON COLUMN script.is_manual IS '是否人工录入';
COMMENT ON COLUMN script.created_at IS '创建时间';




COMMENT ON TABLE procedure_dependency IS '过程依赖关系：记录过程之间的嵌套调用关系。';
COMMENT ON COLUMN procedure_dependency.uuid IS '主键 UUID';
COMMENT ON COLUMN procedure_dependency.caller_proc_uuid IS '调用者存储过程 UUID';
COMMENT ON COLUMN procedure_dependency.callee_proc_uuid IS '被调用存储过程 UUID';
COMMENT ON COLUMN procedure_dependency.condition IS '调用条件说明';
COMMENT ON COLUMN procedure_dependency.created_at IS '创建时间';




COMMENT ON TABLE procedure_read_table IS '过程读取表：记录每个过程读取的源表。';
COMMENT ON COLUMN procedure_read_table.uuid IS '主键 UUID';
COMMENT ON COLUMN procedure_read_table.script_uuid IS '过程 UUID';
COMMENT ON COLUMN procedure_read_table.table_uuid IS '读取的表 UUID';
COMMENT ON COLUMN procedure_read_table.access_type IS '读取类型（select/join/exists）';
COMMENT ON COLUMN procedure_read_table.condition IS '读取条件';
COMMENT ON COLUMN procedure_read_table.is_manual IS '是否人工录入';
COMMENT ON COLUMN procedure_read_table.created_at IS '创建时间';



COMMENT ON TABLE procedure_write_table IS '过程写入表：记录每个过程写入的目标表。';
COMMENT ON COLUMN procedure_write_table.uuid IS '主键 UUID';
COMMENT ON COLUMN procedure_write_table.script_uuid IS '过程 UUID';
COMMENT ON COLUMN procedure_write_table.table_uuid IS '写入的表 UUID';
COMMENT ON COLUMN procedure_write_table.write_type IS '写入方式（insert/create/merge）';
COMMENT ON COLUMN procedure_write_table.is_final_output IS '是否最终结果表';
COMMENT ON COLUMN procedure_write_table.created_at IS '创建时间';



COMMENT ON TABLE table_swap IS '表切换记录：记录过程执行中发生的表切换行为。';
COMMENT ON COLUMN table_swap.uuid IS '主键 UUID';
COMMENT ON COLUMN table_swap.final_table_uuid IS '最终表 UUID';
COMMENT ON COLUMN table_swap.temp_table_uuid IS '临时表 UUID';
COMMENT ON COLUMN table_swap.script_uuid IS '切换发生的过程 UUID';
COMMENT ON COLUMN table_swap.swap_type IS '切换类型（rename/drop）';
COMMENT ON COLUMN table_swap.created_at IS '创建时间';




COMMENT ON TABLE table_lineage IS '表级血缘：记录表之间的输入输出依赖关系。';
COMMENT ON COLUMN table_lineage.uuid IS '主键 UUID';
COMMENT ON COLUMN table_lineage.from_table_uuid IS '来源表 UUID';
COMMENT ON COLUMN table_lineage.to_table_uuid IS '目标表 UUID';
COMMENT ON COLUMN table_lineage.task_uuid IS '调度任务 UUID';
COMMENT ON COLUMN table_lineage.script_uuid IS '来源脚本 UUID';
COMMENT ON COLUMN table_lineage.is_manual IS '是否人工创建';
COMMENT ON COLUMN table_lineage.created_at IS '创建时间';



COMMENT ON TABLE api_endpoint IS 'API 接口定义：记录对外暴露的查询/数据服务接口。';
COMMENT ON COLUMN api_endpoint.uuid IS '主键 UUID';
COMMENT ON COLUMN api_endpoint.name IS '接口名称';
COMMENT ON COLUMN api_endpoint.path IS '接口路径';
COMMENT ON COLUMN api_endpoint.method IS 'HTTP 方法';
COMMENT ON COLUMN api_endpoint.script_uuid IS '绑定的后端脚本 UUID';
COMMENT ON COLUMN api_endpoint.description IS '接口描述';
COMMENT ON COLUMN api_endpoint.is_manual IS '是否人工录入';
COMMENT ON COLUMN api_endpoint.created_at IS '创建时间';



COMMENT ON TABLE api_table_relation IS '接口与表的关系映射：表示接口查询了哪些表。';
COMMENT ON COLUMN api_table_relation.uuid IS '主键 UUID';
COMMENT ON COLUMN api_table_relation.api_uuid IS '接口 UUID';
COMMENT ON COLUMN api_table_relation.table_uuid IS '查询的表 UUID';
COMMENT ON COLUMN api_table_relation.field_mapping IS '字段映射信息（JSON）';
COMMENT ON COLUMN api_table_relation.is_manual IS '是否人工添加';
COMMENT ON COLUMN api_table_relation.created_at IS '创建时间';