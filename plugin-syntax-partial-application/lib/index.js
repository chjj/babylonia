"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-partial-application",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("partialApplication");
    }
  };
});

//# sourceMappingURL=index.js.map
