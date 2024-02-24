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
    name: "transform-reserved-words",
    visitor: {
      "BindingIdentifier|ReferencedIdentifier"(path) {
        if (!_core.types.isValidES3Identifier(path.node.name)) {
          path.scope.rename(path.node.name);
        }
      }
    }
  };
});

//# sourceMappingURL=index.js.map
