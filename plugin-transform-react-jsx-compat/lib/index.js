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

function _helperBuilderReactJsx() {
  const data = _interopRequireDefault(require("babylonia/helper-builder-react-jsx"));

  _helperBuilderReactJsx = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);
  return {
    name: "transform-react-jsx-compat",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    },

    visitor: (0, _helperBuilderReactJsx().default)({
      pre(state) {
        state.callee = state.tagExpr;
      },

      post(state) {
        if (_core().types.react.isCompatTag(state.tagName)) {
          state.call = _core().types.callExpression(_core().types.memberExpression(_core().types.memberExpression(_core().types.identifier("React"), _core().types.identifier("DOM")), state.tagExpr, _core().types.isLiteral(state.tagExpr)), state.args);
        }
      },

      compat: true
    })
  };
});

exports.default = _default;