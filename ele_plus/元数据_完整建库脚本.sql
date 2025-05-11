-- 数据源表
CREATE TABLE
    data_source (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128) NOT NULL,
        type VARCHAR(64),
        config JSONB,
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Schema（逻辑库）
CREATE TABLE
    schema_metadata (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128) NOT NULL,
        data_source_uuid UUID REFERENCES data_source (uuid),
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 表
CREATE TABLE
    table_metadata (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128) NOT NULL,
        schema_uuid UUID REFERENCES schema_metadata (uuid),
        layer VARCHAR(16),
        type VARCHAR(32),
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 字段
CREATE TABLE
    column_metadata (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        table_uuid UUID REFERENCES table_metadata (uuid),
        name VARCHAR(128),
        type VARCHAR(64),
        is_pk BOOLEAN DEFAULT FALSE,
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 调度平台
CREATE TABLE
    schedule_platform (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(64),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 调度任务
CREATE TABLE
    schedule_task (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128),
        platform_uuid UUID REFERENCES schedule_platform (uuid),
        cron VARCHAR(64),
        type VARCHAR(32),
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 子任务
CREATE TABLE
    schedule_sub_task (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        task_uuid UUID REFERENCES schedule_task (uuid),
        name VARCHAR(128),
        sequence INT,
        script_uuid UUID,
        output_table_uuid UUID REFERENCES table_metadata (uuid),
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 任务依赖
CREATE TABLE
    task_dependency (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        task_uuid UUID REFERENCES schedule_task (uuid),
        depends_on_task_uuid UUID REFERENCES schedule_task (uuid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 脚本/存储过程
CREATE TABLE
    script (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128),
        type VARCHAR(32),
        content TEXT,
        parsed BOOLEAN DEFAULT FALSE,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 存储过程依赖（嵌套调用）
CREATE TABLE
    procedure_dependency (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        caller_proc_uuid UUID REFERENCES script (uuid),
        callee_proc_uuid UUID REFERENCES script (uuid),
        condition TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 存储过程读取表
CREATE TABLE
    procedure_read_table (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        script_uuid UUID REFERENCES script (uuid),
        table_uuid UUID REFERENCES table_metadata (uuid),
        access_type VARCHAR(16),
        condition TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 存储过程写入表
CREATE TABLE
    procedure_write_table (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        script_uuid UUID REFERENCES script (uuid),
        table_uuid UUID REFERENCES table_metadata (uuid),
        write_type VARCHAR(16),
        is_final_output BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 表切换记录
CREATE TABLE
    table_swap (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        final_table_uuid UUID REFERENCES table_metadata (uuid),
        temp_table_uuid UUID REFERENCES table_metadata (uuid),
        script_uuid UUID REFERENCES script (uuid),
        swap_type VARCHAR(16),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 表级血缘
CREATE TABLE
    table_lineage (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        from_table_uuid UUID REFERENCES table_metadata (uuid),
        to_table_uuid UUID REFERENCES table_metadata (uuid),
        task_uuid UUID REFERENCES schedule_task (uuid),
        script_uuid UUID REFERENCES script (uuid),
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 接口定义
CREATE TABLE
    api_endpoint (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(128),
        path VARCHAR(256),
        method VARCHAR(16),
        script_uuid UUID REFERENCES script (uuid),
        description TEXT,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 接口表关系
CREATE TABLE
    api_table_relation (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        api_uuid UUID REFERENCES api_endpoint (uuid),
        table_uuid UUID REFERENCES table_metadata (uuid),
        field_mapping JSONB,
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 字段级血缘表
CREATE TABLE
    field_lineage (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        from_table_uuid UUID REFERENCES table_metadata (uuid),
        from_column_name VARCHAR,
        to_table_uuid UUID REFERENCES table_metadata (uuid),
        to_column_name VARCHAR,
        script_uuid UUID REFERENCES script (uuid),
        transform_expr TEXT, -- 字段变化表达式（如 sum(amount)）
        is_manual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 接口字段 → 表字段映射
CREATE TABLE
    api_field_mapping (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        api_uuid UUID REFERENCES api_endpoint (uuid),
        api_field_name VARCHAR, -- 接口输出字段名
        source_table_uuid UUID, -- 对应表
        source_column_name VARCHAR, -- 对应字段
        script_uuid UUID, -- 来自哪个过程或脚本
        transform_expr TEXT, -- 转换表达式（如 round(sum(x), 2)）
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );