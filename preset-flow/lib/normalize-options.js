"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;
var _helperValidatorOption = require("babylonia/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("babylonia/preset-flow");
function normalizeOptions(options = {}) {
  let {
    all,
    ignoreExtensions
  } = options;
  const {
    allowDeclareFields
  } = options;
  {
    return {
      all,
      allowDeclareFields,
      ignoreExtensions
    };
  }
}

//# sourceMappingURL=normalize-options.js.map
