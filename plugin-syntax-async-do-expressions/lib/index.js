"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-async-do-expressions",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("asyncDoExpressions", "doExpressions");
    }
  };
});

//# sourceMappingURL=index.js.map
