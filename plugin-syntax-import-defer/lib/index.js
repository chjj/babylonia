"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-import-defer",
    manipulateOptions(_, parserOpts) {
      parserOpts.plugins.push("deferredImportEvaluation");
    }
  };
});

//# sourceMappingURL=index.js.map
