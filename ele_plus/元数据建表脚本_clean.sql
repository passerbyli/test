CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 数据源表：记录系统中接入的所有外部或内部数据源，如 MySQL、PostgreSQL、API、MQS、Spark 等。
CREATE TABLE data_source (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 唯一标识符，用于同步 Neo4j
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    -- 数据源名称
    name VARCHAR(128) NOT NULL,
    -- 数据源类型，如 mysql/pgsql/api/mqs/spark
    type VARCHAR(64),
    -- 连接配置参数，JSON 格式
    config JSONB,
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 最后更新时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schema 表：记录每个数据源下的逻辑数据库（schema）信息。
CREATE TABLE schema_metadata (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 唯一标识符
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    -- Schema 名称
    name VARCHAR(128) NOT NULL,
    -- 所属数据源 ID
    data_source_id INTEGER REFERENCES data_source(id),
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 最后更新时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 表信息表：记录系统中所有数据表、视图的元信息。
CREATE TABLE table_metadata (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 唯一标识符
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    -- 表名
    name VARCHAR(128) NOT NULL,
    -- 所属 schema
    schema_id INTEGER REFERENCES schema(id),
    -- 所属数据分层，如 ods/dwd/dws/ads
    layer VARCHAR(16),
    -- 表类型，如 table/view/tmp
    type VARCHAR(32),
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 最后更新时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 字段信息表：记录每张表的字段明细。
CREATE TABLE column_metadata (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 所属表 ID
    table_id INTEGER REFERENCES table_metadata(id),
    -- 字段名
    name VARCHAR(128),
    -- 字段类型
    type VARCHAR(64),
    -- 是否主键
    is_pk BOOLEAN DEFAULT FALSE,
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 最后更新时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 调度平台表：记录所有支持的调度平台，如 Azkaban、Airflow、DolphinScheduler、自研系统等。
CREATE TABLE schedule_platform (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 平台名称
    name VARCHAR(64) NOT NULL,
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 调度任务表：记录调度平台中的任务定义，可包含多个子任务。
CREATE TABLE schedule_task (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 唯一标识符
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    -- 任务名
    name VARCHAR(128) NOT NULL,
    -- 所属调度平台
    platform_id INTEGER REFERENCES schedule_platform(id),
    -- 调度周期表达式
    cron VARCHAR(64),
    -- 任务类型，如 sql/stored_proc/api/sync
    type VARCHAR(32),
    -- 描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 最后更新时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 调度子任务表：调度任务的子节点，支持 DAG 结构的顺序执行。
CREATE TABLE schedule_sub_task (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 所属主任务 ID
    task_id INTEGER REFERENCES schedule_task(id),
    -- 子任务名
    name VARCHAR(128),
    -- 子任务执行顺序
    sequence INT,
    -- 执行脚本 ID
    script_id INTEGER,
    -- 产出表 ID
    output_table_id INTEGER REFERENCES table_metadata(id),
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 调度任务依赖表：定义调度任务之间的先后依赖关系。
CREATE TABLE task_dependency (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 当前任务
    task_id INTEGER REFERENCES schedule_task(id),
    -- 依赖的上游任务
    depends_on_task_id INTEGER REFERENCES schedule_task(id),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SQL 脚本或存储过程表：记录调度中使用的 SQL 脚本或存储过程。
CREATE TABLE script (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 脚本名
    name VARCHAR(128),
    -- 类型，如 sql/stored_proc/api
    type VARCHAR(32),
    -- 脚本内容
    content TEXT,
    -- 是否已解析依赖
    parsed BOOLEAN DEFAULT FALSE,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 接口定义表：记录服务接口元数据。
CREATE TABLE api_endpoint (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 接口名
    name VARCHAR(128),
    -- 请求路径
    path VARCHAR(256),
    -- 请求方法
    method VARCHAR(16),
    -- 接口描述
    description TEXT,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 最后更新人
    updated_by VARCHAR(64),
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 接口与表的关系映射表：记录接口查询了哪些表。
CREATE TABLE api_table_relation (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 接口 ID
    api_id INTEGER REFERENCES api_endpoint(id),
    -- 被查询的表
    table_id INTEGER REFERENCES table_metadata(id),
    -- 字段映射信息
    field_mapping JSONB,
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 表级血缘关系表：记录表之间的依赖关系，来源于 SQL 分析或人工添加。
CREATE TABLE table_lineage (
    -- 主键
    id SERIAL PRIMARY KEY,
    -- 来源表 ID
    from_table_id INTEGER REFERENCES table_metadata(id),
    -- 目标表 ID
    to_table_id INTEGER REFERENCES table_metadata(id),
    -- 调度任务 ID
    task_id INTEGER REFERENCES schedule_task(id),
    -- 执行脚本 ID
    script_id INTEGER REFERENCES script(id),
    -- 记录人
    updated_by VARCHAR(64),
    -- 是否人工添加
    is_manual BOOLEAN DEFAULT FALSE,
    -- 创建时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

