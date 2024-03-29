"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _core = require("babylonia/core");
var _default = exports.default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  const {
    helperVersion = "7.0.0-beta.0",
    whitelist = false
  } = options;
  if (whitelist !== false && (!Array.isArray(whitelist) || whitelist.some(w => typeof w !== "string"))) {
    throw new Error(".whitelist must be undefined, false, or an array of strings");
  }
  const helperWhitelist = whitelist ? new Set(whitelist) : null;
  return {
    name: "external-helpers",
    pre(file) {
      file.set("helperGenerator", name => {
        if (file.availableHelper && !file.availableHelper(name, helperVersion)) {
          return;
        }
        if (helperWhitelist && !helperWhitelist.has(name)) return;
        return _core.types.memberExpression(_core.types.identifier("babelHelpers"), _core.types.identifier(name));
      });
    }
  };
});

//# sourceMappingURL=index.js.map
