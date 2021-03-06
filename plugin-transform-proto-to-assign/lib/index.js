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

function _pull() {
  const data = _interopRequireDefault(require("lodash/pull"));

  _pull = function () {
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

  function isProtoKey(node) {
    return _core().types.isLiteral(_core().types.toComputedKey(node, node.key), {
      value: "__proto__"
    });
  }

  function isProtoAssignmentExpression(node) {
    const left = node.left;
    return _core().types.isMemberExpression(left) && _core().types.isLiteral(_core().types.toComputedKey(left, left.property), {
      value: "__proto__"
    });
  }

  function buildDefaultsCallExpression(expr, ref, file) {
    return _core().types.expressionStatement(_core().types.callExpression(file.addHelper("defaults"), [ref, expr.right]));
  }

  return {
    name: "transform-proto-to-assign",
    visitor: {
      AssignmentExpression(path, file) {
        if (!isProtoAssignmentExpression(path.node)) return;
        const nodes = [];
        const left = path.node.left.object;
        const temp = path.scope.maybeGenerateMemoised(left);

        if (temp) {
          nodes.push(_core().types.expressionStatement(_core().types.assignmentExpression("=", temp, left)));
        }

        nodes.push(buildDefaultsCallExpression(path.node, _core().types.cloneNode(temp || left), file));
        if (temp) nodes.push(_core().types.cloneNode(temp));
        path.replaceWithMultiple(nodes);
      },

      ExpressionStatement(path, file) {
        const expr = path.node.expression;
        if (!_core().types.isAssignmentExpression(expr, {
          operator: "="
        })) return;

        if (isProtoAssignmentExpression(expr)) {
          path.replaceWith(buildDefaultsCallExpression(expr, expr.left.object, file));
        }
      },

      ObjectExpression(path, file) {
        let proto;
        const {
          node
        } = path;

        for (const prop of node.properties) {
          if (isProtoKey(prop)) {
            proto = prop.value;
            (0, _pull().default)(node.properties, prop);
          }
        }

        if (proto) {
          const args = [_core().types.objectExpression([]), proto];
          if (node.properties.length) args.push(node);
          path.replaceWith(_core().types.callExpression(file.addHelper("extends"), args));
        }
      }

    }
  };
});

exports.default = _default;