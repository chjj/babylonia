"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion("^7.22.0");
  return {
    name: "syntax-import-source",
    manipulateOptions({
      parserOpts
    }) {
      parserOpts.plugins.push("sourcePhaseImports");
      parserOpts.createImportExpressions = true;
    }
  };
});

//# sourceMappingURL=index.js.map
