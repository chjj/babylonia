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

function defineMap() {
  const data = _interopRequireWildcard(require("babylonia/helper-define-map"));

  defineMap = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require("babylonia/core");

  _core = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);
  return {
    name: "transform-property-mutators",
    visitor: {
      ObjectExpression(path, file) {
        const {
          node
        } = path;
        let hasAny = false;

        for (const prop of node.properties) {
          if (prop.kind === "get" || prop.kind === "set") {
            hasAny = true;
            break;
          }
        }

        if (!hasAny) return;
        const mutatorMap = {};
        node.properties = node.properties.filter(function (prop) {
          if (!prop.computed && (prop.kind === "get" || prop.kind === "set")) {
            defineMap().push(mutatorMap, prop, null, file);
            return false;
          } else {
            return true;
          }
        });
        path.replaceWith(_core().types.callExpression(_core().types.memberExpression(_core().types.identifier("Object"), _core().types.identifier("defineProperties")), [node, defineMap().toDefineObject(mutatorMap)]));
      }

    }
  };
});

exports.default = _default;