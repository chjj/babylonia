"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _helperValidatorOption = require("babylonia/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("babylonia/plugin-syntax-optional-chaining-assign");
var _default = exports.default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion("^7.23.0");
  v.validateTopLevelOptions(options, {
    version: "version"
  });
  const {
    version
  } = options;
  v.invariant(version === "2023-07", "'.version' option required, representing the last proposal update. " + "Currently, the only supported value is '2023-07'.");
  return {
    name: "syntax-optional-chaining-assign",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(["optionalChainingAssign", {
        version
      }]);
    }
  };
});

//# sourceMappingURL=index.js.map
