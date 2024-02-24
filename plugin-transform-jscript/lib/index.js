"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _core = require("babylonia/core");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
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
          path.replaceWith(_core.types.callExpression(_core.types.functionExpression(null, [], _core.types.blockStatement([_core.types.toStatement(node), _core.types.returnStatement(_core.types.cloneNode(node.id))])), []));
        }
      }
    }
  };
});

//# sourceMappingURL=index.js.map
