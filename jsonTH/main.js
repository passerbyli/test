const fs = require("fs");

// const i18n = JSON.parse(fs.readFileSync("i18n.json", "utf-8"));
// const sheetData = JSON.parse(fs.readFileSync("sheetData.json", "utf-8"));
// const modelData = JSON.parse(fs.readFileSync("modelData.json", "utf-8"));

const i18n = {
  中文: "chinese",
  总数: "count",
  字段: "filed",
  笔记本电脑: "mac book",
};
const sheetData = {
  cells: [
    {
      xAxis: {
        label: "笔记本电脑",
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    },
    {
      id: "213",
      name: "jdiaso",
      type: "table",
      setting: {
        linkageType: 1,
        field: {
          "table.field1_cn": {
            type: "drill",
            target: "xx-xx-xx",
            drillType: "page",
            extra: [
              {
                type: "field",
                fieldValue: "",
                field: "table.field1_cn_type",
                values: [],
                multiple: true,
                SelectedValues: [],
                typeValue: 1,
              },
              {
                type: "field",
                fieldValue: "",
                field: "table.国家_中文_类型",
                values: [],
                multiple: true,
                SelectedValues: ["法国"],
                typeValue: 1,
              },
            ],
            nodeId: "",
            fieldCfg: {
              list: [
                "table.字段_中文",
                "table.field1_name_cn",
                "table.field999_name_cn",
                "table.field1_name",
              ],
              isSelectAll: true,
            },
          },
        },
      },
      config: {
        rowList: [
          {
            id: 1,
            label: "field1Name_cn",
            name: "field1_cn",
            treeId: "table.field1_cn",
            treeName: "field1Name_cn",
          },
        ],
      },
    },
    {
      id: "213",
      name: "jdiaso",
      type: "table",
      config: {
        yAxis: [
          {
            conifg: {
              fieldConf: {
                id: 6,
                name: "国家_中文_类型",
                expression: "qqqqq",
                tableName: "table",
                type: "number",
                treeId: "table.国家_中文_类型",
              },
            },
          },
        ],
      },
      sortField: {
        id: 6,
        iconType: "measure",
        label: "国家_中文_类型",
        expression: "xxxxxxx",
        name: "国家_中文_类型",
        treeId: "table.国家_中文_类型",
        treeName: "国家_中文_类型",
        displayName: "国家_中文_类型",
      },
      defaultFiled: {
        id: 1,
        label: "field1Name_cn",
        name: "field1_cn",
        treeId: "table.field1_cn",
        treeName: "field1Name_cn",
      },
    },
  ],
  filters: [],
};
const modelData = [
  {
    id: 10000,
    name: "table",
    tables: [
      {
        id: 1,
        field: "field1_cn",
        label: "field1Name_cn",
        type: "varchar(100)",
        AliaseName: "aliaseName_cn",
        tableName: "table",
      },
      {
        id: 2,
        field: "field1_en",
        label: "field1Name_cn",
        type: "varchar(100)",
        AliaseName: "aliaseName_cn",
        tableName: "table",
      },
      {
        id: 3,
        field: "field1_cn_type",
        label: "field1Name_cn_type",
        type: "varchar(100)",
        AliaseName: "aliaseName_cn_type",
        tableName: "table",
      },
      {
        id: 4,
        field: "field1_en_type",
        label: "field1Name_en_type",
        type: "varchar(100)",
        AliaseName: "aliaseName_en_type",
        tableName: "table",
      },
    ],
    measures: [
      {
        id: 5,
        name: "总数_中文",
        expression: "xxxxxxx",
        tableName: "table",
        type: "number",
      },
      {
        id: 6,
        name: "国家_中文_类型",
        expression: "qqqqq",
        tableName: "table",
        type: "number",
      },
      {
        id: 7,
        name: "国家_英文_类型",
        expression: "qqqqq_en",
        tableName: "table",
        type: "number",
      },
    ],
  },
  {
    id: 10001,
    name: "table1",
    tables: [
      {
        id: 8,
        field: "field9_cn",
        label: "field9Name_cn",
        type: "varchar(100)",
        AliaseName: "aliaseName9_cn",
        tableName: "table1",
      },
    ],
  },
];
// 定义需要替换的属性名
const replaceableKeys = ["label", "name", "displayName", "aliaName"];

// 定义映射表，配置 treeObj 和 enObj 的属性对应关系
const replaceMapping = {
  label: "name",
  name: "name", // treeObj.name 替换为 enObj.field
  field: "name", // treeObj.field 替换为 enObj.label
  id: "id", // treeObj.id 替换为 enObj.id
  expression: "expression", // treeObj.expression 替换为 enObj.expression
};

// 查找并替换 treeId 对应的中文字段
function translateTreeId(obj, modelData) {
  if (obj.treeId) {
    const arr = obj.treeId.split(".");
    const tableName = arr[0];
    let fieldName = arr[1];

    // 替换字段名的中文标识为英文标识
    if (fieldName.endsWith("_cn") || fieldName.endsWith("_中文")) {
      fieldName = fieldName.replace("_cn", "_en").replace("_中文", "_英文");
    } else if (fieldName.includes("_cn_") || fieldName.includes("_中文_")) {
      fieldName = fieldName.replace("_cn_", "_en_").replace("_中文_", "_英文_");
    }

    // 查找 modelData 中对应的 table
    const tableObj = modelData.find((table) => table.name === tableName);
    if (!tableObj) {
      console.warn(`未找到匹配的表: ${tableName}`);
      return;
    }

    // 在 tableObj.tables 和 tableObj.measures 中查找对应的字段
    let enObj =
      tableObj.tables.find((t) => t.field === fieldName) ||
      tableObj.measures.find((m) => m.name === fieldName);

    if (enObj) {
      obj.treeId = `${tableName}.${fieldName}`;
      // 遍历映射表进行属性替换
      Object.keys(replaceMapping).forEach((key) => {
        const mapping = replaceMapping[key];
        if (obj[key] && enObj[mapping]) {
          obj[key] = enObj[mapping];
        }
      });
    } else {
      console.warn(`未找到对应的字段: ${fieldName} 在表: ${tableName}`);
    }
  }
}

// 查找并替换 setting 节点中的 field 属性
function translateSettingField(setting, modelData) {
  if (!setting.field || typeof setting.field !== "object") return;

  for (let fieldKey in setting.field) {
    let fieldObj = setting.field[fieldKey];

    if (typeof fieldObj === "object") {
      const arr = fieldKey.split(".");
      const tableName = arr[0];
      let fieldName = arr[1];

      // 替换字段名中的 _cn 和 _中文
      if (fieldName.endsWith("_cn") || fieldName.endsWith("_中文")) {
        fieldName = fieldName.replace("_cn", "_en").replace("_中文", "_英文");
      } else if (fieldName.includes("_cn_") || fieldName.includes("_中文_")) {
        fieldName = fieldName
          .replace("_cn_", "_en_")
          .replace("_中文_", "_英文_");
      }

      // 查找 modelData 中的对应表和字段
      const tableObj = modelData.find((table) => table.name === tableName);
      if (!tableObj) {
        console.warn(`未找到匹配的表: ${tableName}`);
        continue;
      }

      const enObj =
        tableObj.tables.find((t) => t.field === fieldName) ||
        tableObj.measures.find((m) => m.name === fieldName);

      if (enObj) {
        console.log(fieldObj);
        // 遍历映射表进行属性替换
        Object.keys(replaceMapping).forEach((key) => {
          const mapping = replaceMapping[key];
          if (fieldObj[key] && enObj[mapping]) {
            fieldObj[key] = enObj[mapping];
          }
        });

        // 处理 extra 数组
        if (fieldObj.extra && Array.isArray(fieldObj.extra)) {
          fieldObj.extra.forEach((extraItem) => {
            if (
              !extraItem.SelectedValues ||
              extraItem.SelectedValues.length === 0
            ) {
              // 处理 extra 中的 field
              const arr = extraItem.field.split(".");
              let extraFieldName = arr[1];
              if (
                extraFieldName.endsWith("_cn") ||
                extraFieldName.endsWith("_中文")
              ) {
                extraFieldName = extraFieldName
                  .replace("_cn", "_en")
                  .replace("_中文", "_英文");
              } else if (
                extraFieldName.includes("_cn_") ||
                extraFieldName.includes("_中文_")
              ) {
                extraFieldName = extraFieldName
                  .replace("_cn_", "_en_")
                  .replace("_中文_", "_英文_");
              }
              extraItem.field = `${arr[0]}.${extraFieldName}`;

              translateSettingField(
                { field: { [extraItem.field]: extraItem } },
                modelData
              );
            }
          });
        }

        // 处理 fieldCfg.list 数组
        if (fieldObj.fieldCfg && Array.isArray(fieldObj.fieldCfg.list)) {
          fieldObj.fieldCfg.list = fieldObj.fieldCfg.list.map((listItem) => {
            const arr = listItem.split(".");
            let listFieldName = arr[1];
            if (
              listFieldName.endsWith("_cn") ||
              listFieldName.endsWith("_中文")
            ) {
              listFieldName = listFieldName
                .replace("_cn", "_en")
                .replace("_中文", "_英文");
            }
            return `${arr[0]}.${listFieldName}`;
          });
        }
      } else {
        console.warn(`未找到对应的字段: ${fieldName} 在表: ${tableName}`);
      }
    }
  }
}

// 通用递归遍历函数，翻译 treeId 和 setting 中的 field
function recursiveTranslate(obj, modelData) {
  if (!obj || typeof obj !== "object") return;

  // 检查是否有 treeId 属性并翻译
  if (obj.treeId) {
    try {
      translateTreeId(obj, modelData);
    } catch (error) {
      console.error(`处理 treeId: ${obj.treeId} 时出错: ${error.message}`);
    }
  }

  // 检查是否有 setting 节点并翻译 field
  if (obj.setting) {
    try {
      translateSettingField(obj.setting, modelData);
    } catch (error) {
      console.error(`处理 setting 节点时出错: ${error.message}`);
    }
  }

  // 递归处理对象或数组
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      recursiveTranslate(obj[key], modelData);
    }
  }
}
// 处理 i18n 替换逻辑
function applyI18nTranslation(obj, i18n) {
  if (!obj || typeof obj !== "object") {
    return;
  }
  // 如果是数组，递归处理数组的每个元素
  if (Array.isArray(obj)) {
    obj.forEach((item) => applyI18nTranslation(item, i18n));
    return;
  }
  // 遍历对象的属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 判断属性名是否在需要替换的范围内
      if (replaceableKeys.includes(key) && typeof obj[key] === "string") {
        const originalValue = obj[key];
        const translatedValue = i18n[originalValue];

        // 如果在 i18n 中找到对应的翻译
        if (translatedValue) {
          // 保留原值，属性名后添加 `________` 后缀
          obj[`${key}________`] = originalValue;
          // 替换当前值为翻译后的值
          obj[key] = translatedValue;
        }
      }

      // 递归处理子对象或数组
      if (typeof obj[key] === "object") {
        applyI18nTranslation(obj[key], i18n);
      }
    }
  }
}

// 执行翻译并处理潜在错误
try {
  recursiveTranslate(sheetData, modelData);
  // 再对 sheetData 进行 i18n 翻译
  applyI18nTranslation(sheetData, i18n);
  // 保存新生成的 JSON 文件
  fs.writeFileSync(
    "sheetData_en.json",
    JSON.stringify(sheetData, null, 2),
    "utf-8"
  );
  console.log("JSON 文件已成功生成并保存为 sheetData_en.json");
} catch (error) {
  console.error(`执行翻译时发生错误: ${error.message}`);
}
