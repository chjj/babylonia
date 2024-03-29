var _Object$keys = require("core-js/library/fn/object/keys.js");
var _Object$getOwnPropertySymbols = require("core-js/library/fn/object/get-own-property-symbols.js");
var _Object$getOwnPropertyDescriptor = require("core-js/library/fn/object/get-own-property-descriptor.js");
var defineProperty = require("./defineProperty.js");
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = _Object$keys(source);
    if (typeof _Object$getOwnPropertySymbols === 'function') {
      ownKeys.push.apply(ownKeys, _Object$getOwnPropertySymbols(source).filter(function (sym) {
        return _Object$getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }
  return target;
}
module.exports = _objectSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;