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
    name: "transform-strict-mode",
    visitor: {
      Program(path) {
        const {
          node
        } = path;

        for (const directive of node.directives) {
          if (directive.value.value === "use strict") return;
        }

        path.unshiftContainer("directives", _core().types.directive(_core().types.directiveLiteral("use strict")));
      }

    }
  };
});

exports.default = _default;