var _Reflect$construct = require("core-js/library/fn/reflect/construct.js");
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {}));
  } catch (t) {}
  return (module.exports = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;