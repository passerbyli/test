drop table if exists ads_dl.metadata_schema;
drop table if exists ads_dl.metadata_table;
drop table if exists ads_dl.metadata_field;
drop table if exists ads_dl.metadata_sqlscript;
drop table if exists ads_dl.metadata_schedule;
drop table if exists ads_dl.metadata_table_lineage;

-- schema表
create sequence if not exists ads_dl.metadata_schema_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists ads_dl.metadata_schema
(
    id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_schema_id_seq'::regclass),

    name             VARCHAR(128) NOT NULL,
    description      varchar(400)
);

COMMENT ON TABLE ads_dl.metadata_schema IS 'Schema表';
COMMENT ON COLUMN ads_dl.metadata_schema.name IS 'Schema 名称';
COMMENT ON COLUMN ads_dl.metadata_schema.description IS '描述';



-- table表
create sequence if not exists ads_dl.metadata_table_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists ads_dl.metadata_table
(
    id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_table_id_seq'::regclass),

    name             VARCHAR(128) NOT NULL,
    description      varchar(400),
    layer VARCHAR(128),
    type VARCHAR(128),
    schema_id BIGINT ,
    schema_name VARCHAR(128)
);

COMMENT ON TABLE ads_dl.metadata_table IS 'table表';
COMMENT ON COLUMN ads_dl.metadata_table.name IS '表名称';
COMMENT ON COLUMN ads_dl.metadata_table.description IS '描述';
COMMENT ON COLUMN ads_dl.metadata_table.layer IS '所属分层（如 ods、dwd、dws、ads）';
COMMENT ON COLUMN ads_dl.metadata_table.type IS '表类型（table、view、tmp）';
COMMENT ON COLUMN ads_dl.metadata_table.schema_id IS 'schema_id';
COMMENT ON COLUMN ads_dl.metadata_table.schema_name IS 'schema名称';


-- 字段表
create sequence if not exists ads_dl.metadata_field_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists
    ads_dl.metadata_field (
                              id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_field_id_seq'::regclass),

                              name             VARCHAR(128) NOT NULL,
                              description      varchar(400),
                              field_type       varchar(400),
                              field_length     varchar(400),
                              field_alias      varchar(400)

);

COMMENT ON TABLE ads_dl.metadata_field IS '字段表';
COMMENT ON COLUMN ads_dl.metadata_field.name IS '字段名称';
COMMENT ON COLUMN ads_dl.metadata_field.description IS '字段描述';
COMMENT ON COLUMN ads_dl.metadata_field.field_type IS '字段类型';
COMMENT ON COLUMN ads_dl.metadata_field.field_length IS '字段长度';
COMMENT ON COLUMN ads_dl.metadata_field.field_alias IS '字段别名';



-- sql脚本表
create sequence if not exists ads_dl.metadata_sqlscript_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists ads_dl.metadata_sqlscript
(
    id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_sqlscript_id_seq'::regclass),

    name             VARCHAR(128) NOT NULL,
    description      varchar(400),
    schema_id BIGINT ,
    schema_name VARCHAR(128),
    type varchar(128),
    content TEXT,
    parsed BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE ads_dl.metadata_sqlscript IS 'sql脚本表';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.name IS 'sql脚本名称';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.description IS '描述';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.schema_id IS 'schema_id';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.schema_name IS 'schema名称';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.type IS '脚本类型（sql/etl/proc/bids）';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.content IS '脚本/过程内容';
COMMENT ON COLUMN ads_dl.metadata_sqlscript.parsed IS '是否已解析依赖';

-- 表记血缘表
create sequence if not exists ads_dl.metadata_table_lineage_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists ads_dl.metadata_table_lineage
(
    id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_table_lineage_id_seq'::regclass),

    name             VARCHAR(128) NOT NULL,
    description      varchar(400),
    from_table_id BIGINT ,
    from_table_name VARCHAR(128),
    to_table_id BIGINT ,
    to_table_name VARCHAR(128),
    sql_id BIGINT,
    sql_name VARCHAR(128),
    task_id BIGINT,
    task_name VARCHAR(128)
);

COMMENT ON TABLE ads_dl.metadata_table_lineage IS 'sql脚本表';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.name IS 'sql脚本名称';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.description IS '描述';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.from_table_id IS '来源表_id';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.from_table_name IS '来源表';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.to_table_id IS '目标表_id';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.to_table_name IS '目标表';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.sql_id IS 'sql脚本_id';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.sql_name IS 'sql脚本名称';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.task_id IS '调度_id';
COMMENT ON COLUMN ads_dl.metadata_table_lineage.task_name IS '调度名称';


-- 调度表
create sequence if not exists ads_dl.metadata_schedule_id_seq increment by 1
    start
        with 1
    no cycle;
create table if not exists ads_dl.metadata_schedule
(
    id BIGINT NOT NULL DEFAULT nextval('ads_dl.metadata_schedule_id_seq'::regclass),

    name             VARCHAR(128) NOT NULL,
    description      varchar(400),
    platform VARCHAR(128),
    type varchar(128),
    sql_id bigint,
    sql_name varchar(128)
);

COMMENT ON TABLE ads_dl.metadata_schedule IS '调度表';
COMMENT ON COLUMN ads_dl.metadata_schedule.name IS '调度名称';
COMMENT ON COLUMN ads_dl.metadata_schedule.description IS '描述';
COMMENT ON COLUMN ads_dl.metadata_schedule.platform IS '调度平台';
COMMENT ON COLUMN ads_dl.metadata_schedule.type IS '任务类型（sql/stored_proc/api）''';
COMMENT ON COLUMN ads_dl.metadata_schedule.sql_id IS 'sql脚本_id';
COMMENT ON COLUMN ads_dl.metadata_schedule.sql_name IS 'sql脚本名称';



