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

  function hasRefOrSpread(attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (_core().types.isJSXSpreadAttribute(attr)) return true;
      if (isJSXAttributeOfName(attr, "ref")) return true;
    }

    return false;
  }

  function isJSXAttributeOfName(attr, name) {
    return _core().types.isJSXAttribute(attr) && _core().types.isJSXIdentifier(attr.name, {
      name: name
    });
  }

  const visitor = (0, _helperBuilderReactJsx().default)({
    filter(node) {
      return node.openingElement && !hasRefOrSpread(node.openingElement.attributes);
    },

    pre(state) {
      const tagName = state.tagName;
      const args = state.args;

      if (_core().types.react.isCompatTag(tagName)) {
        args.push(_core().types.stringLiteral(tagName));
      } else {
        args.push(state.tagExpr);
      }
    },

    post(state, pass) {
      state.callee = pass.addHelper("jsx");
      const props = state.args[1];
      let hasKey = false;

      if (_core().types.isObjectExpression(props)) {
        const keyIndex = props.properties.findIndex(prop => _core().types.isIdentifier(prop.key, {
          name: "key"
        }));

        if (keyIndex > -1) {
          state.args.splice(2, 0, props.properties[keyIndex].value);
          props.properties.splice(keyIndex, 1);
          hasKey = true;
        }
      } else if (_core().types.isNullLiteral(props)) {
        state.args.splice(1, 1, _core().types.objectExpression([]));
      }

      if (!hasKey && state.args.length > 2) {
        state.args.splice(2, 0, _core().types.unaryExpression("void", _core().types.numericLiteral(0)));
      }
    }

  });
  return {
    name: "transform-react-inline-elements",
    visitor
  };
});

exports.default = _default;