"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("babylonia/helper-plugin-utils");

  _helperPluginUtils = function () {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);
  return {
    name: "syntax-export-namespace-from",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("exportNamespaceFrom");
    }

  };
});

exports.default = _default;