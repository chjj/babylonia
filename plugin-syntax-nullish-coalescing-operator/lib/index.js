"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("babylonia/helper-plugin-utils");

var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-nullish-coalescing-operator",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("nullishCoalescingOperator");
    }

  };
});

exports.default = _default;