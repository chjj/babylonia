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

function _core() {
  const data = require("babylonia/core");

  _core = function () {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);
  return {
    name: "transform-jscript",
    visitor: {
      FunctionExpression: {
        exit(path) {
          const {
            node
          } = path;
          if (!node.id) return;
          path.replaceWith(_core().types.callExpression(_core().types.functionExpression(null, [], _core().types.blockStatement([_core().types.toStatement(node), _core().types.returnStatement(_core().types.cloneNode(node.id))])), []));
        }

      }
    }
  };
});

exports.default = _default;