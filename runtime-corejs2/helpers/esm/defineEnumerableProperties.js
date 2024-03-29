import _Object$defineProperty from "core-js/library/fn/object/define-property.js";
import _Object$getOwnPropertySymbols from "core-js/library/fn/object/get-own-property-symbols.js";
export default function _defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    _Object$defineProperty(obj, key, desc);
  }
  if (_Object$getOwnPropertySymbols) {
    var objectSymbols = _Object$getOwnPropertySymbols(descs);
    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      _Object$defineProperty(obj, sym, desc);
    }
  }
  return obj;
}