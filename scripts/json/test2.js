let sheet = [
  "草稿",
  "评审",
  "概设",
  "开发中",
  "开发完成",
  "sit测试中",
  "sit测试完成",
  "UAT测试",
  "UAT完成",
  "待上线",
  "完成",
];

let stage = {
  开发: ["草稿", "评审", "概设", "开发中", "开发完成"],
  测试: ["sit测试中", "sit测试完成", "UAT测试", "UAT完成"],
  待上线: ["待上线"],
  完成: ["完成"],
};

let list = [
  {
    id: 1,
    name: "1",
    sheetName: "待上线",
    status: "待上线",
  },
  {
    id: 2,
    name: "aaaa",
    sheetName: "开发中",
    status: "开发",
  },
  {
    id: 3,
    name: "bbbb",
    sheetName: "UAT测试",
    status: "测试",
  },
  {
    id: 4,
    name: "cccc",
    sheetName: "完成",
    status: "完成",
  },
  {
    id: 5,
    name: "5",
    sheetName: "UAT测试",
    status: "测试",
  },
  {
    id: 6,
    name: "6",
    sheetName: "开发完成",
    status: "开发",
  },
  {
    id: 7,
    name: "7",
    sheetName: "sit测试完成",
    status: "测试",
  },
  {
    id: 8,
    name: "8",
    sheetName: "评审",
    status: "评审",
  },
];
 



当前角色是开发只能拖动开发状态的版列
当前角色是测试只能从开发完成开始拖动，最后一项为UAT完成。
如果没有指定角色全部跳过不做任何操作。

执行一次脚本要么版列为当前阶段最后一项，要么为下一个阶段的第一项，要么跳过。
每个版列更新都要打日志，日志格式为：id，name，当前版列，当前状态，更新到版列，更新到状态。
使用nodejs实现，list保存在list.json文件里。

举例：如果是开发角色
id=8这一项会更新3次状态，最后停留在sheetName=开发完成

如果是测试
id=6这一项会更新1次状态，最后停留在sheetName=sit测试中
id=7这一项会更新2次状态，最后停留在sheetName=UAT完成





list是任务列表，sheetName为当前版列位置，status为当前阶段。
写一个自动化脚本，分阶段更新sheetName，
1. 阶段一：当前版列不是最后一项，从当前版列位置往后依次更新，直到版列为当前状态的最后一项，这个阶段只更新sheetName字段。
2. 阶段二：当前版列为最后一项，只向后更新一个版列位置，同时还要更新status。
3. 阶段三：当前版列为状态最后一项版列也为最后一项跳过。
4. 只能一步一步的更新，不能跳过某个状态的版列。

执行一次脚步后，
角色为开发：版列都是开发阶段的最后一项，如果状态已经不是开发阶段跳过
角色为测试：版列要么是当前状态最后一项，要么是当前状态的第一项，如果版列不是开发完成或不在测试阶段跳过
角色为空：版列要么是当前状态最后一项，要么是当前状态的第一项

