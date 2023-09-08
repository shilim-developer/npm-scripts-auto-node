"use strict";

module.exports = {
  types: [
    {
      value: "wip",
      name: "💪  WIP:      开发中",
    },
    {
      value: "feat",
      name: "✨  feat:     新功能",
    },
    {
      value: "fix",
      name: "🐞  fix:      bug修复",
    },
    {
      value: "refactor",
      name: "🛠  refactor: 代码重构,优化",
    },
    {
      value: "docs",
      name: "📚  docs:     文档修改",
    },
    {
      value: "test",
      name: "🏁  test:     添加或修改测试",
    },
    {
      value: "chore",
      name: "🗯  chore:    不包含业务代码的更改,比如更新构建任务，包管理器",
    },
    {
      value: "style",
      name: "💅  style:    代码风格，空白、格式、缺少分号等",
    },
    {
      value: "revert",
      name: "⏪  revert:   恢复到提交",
    },
  ],
  scopes: [],
  messages: {
    type: "选择一种你的提交类型(必填):",
    scope: "选择一个适用范围(可选):",
    customScope: "此次提交适用范围(可选):",
    subject: "此次提交说明(必填):\n",
    body: '对于此次提交详细说明，使用"|"换行(可选)：\n',
    breaking: "破坏性升级,如果发行大版本请添加说明,否则直接回车忽略 (可选):\n",
    footer: "关联关闭的issue，例如：#31, #34 (可选):\n",
    confirmCommit: "确定提交说明?",
    footerPrefixesSelect: "选择关闭的issue前缀(可选):",
  },

  allowCustomScopes: true,
  skipQuestions: ["body"],
  allowBreakingChanges: ["feat", "fix"],
};
