const types = require("./cz.config").types;

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    "type-enum": [2, "always", types.map((item) => item.value)],
  },
};
