"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _defineMap = require("./define-map.js");
var _core = require("babylonia/core");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "transform-property-mutators",
    visitor: {
      ObjectExpression(path) {
        const {
          node
        } = path;
        let mutatorMap;
        const newProperties = node.properties.filter(function (prop) {
          if (_core.types.isObjectMethod(prop) && !prop.computed && (prop.kind === "get" || prop.kind === "set")) {
            var _mutatorMap;
            (0, _defineMap.pushAccessor)((_mutatorMap = mutatorMap) != null ? _mutatorMap : mutatorMap = {}, prop);
            return false;
          }
          return true;
        });
        if (mutatorMap === undefined) {
          return;
        }
        node.properties = newProperties;
        path.replaceWith(_core.types.callExpression(_core.types.memberExpression(_core.types.identifier("Object"), _core.types.identifier("defineProperties")), [node, (0, _defineMap.toDefineObject)(mutatorMap)]));
      }
    }
  };
});

//# sourceMappingURL=index.js.map
