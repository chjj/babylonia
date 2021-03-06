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

function _pluginSyntaxFunctionBind() {
  const data = _interopRequireDefault(require("babylonia/plugin-syntax-function-bind"));

  _pluginSyntaxFunctionBind = function () {
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

  function getTempId(scope) {
    let id = scope.path.getData("functionBind");
    if (id) return id;
    id = scope.generateDeclaredUidIdentifier("context");
    return scope.path.setData("functionBind", id);
  }

  function getStaticContext(bind, scope) {
    const object = bind.object || bind.callee.object;
    return scope.isStatic(object) && object;
  }

  function inferBindContext(bind, scope) {
    const staticContext = getStaticContext(bind, scope);
    if (staticContext) return _core().types.cloneNode(staticContext);
    const tempId = getTempId(scope);

    if (bind.object) {
      bind.callee = _core().types.sequenceExpression([_core().types.assignmentExpression("=", tempId, bind.object), bind.callee]);
    } else {
      bind.callee.object = _core().types.assignmentExpression("=", tempId, bind.callee.object);
    }

    return tempId;
  }

  return {
    name: "proposal-function-bind",
    inherits: _pluginSyntaxFunctionBind().default,
    visitor: {
      CallExpression({
        node,
        scope
      }) {
        const bind = node.callee;
        if (!_core().types.isBindExpression(bind)) return;
        const context = inferBindContext(bind, scope);
        node.callee = _core().types.memberExpression(bind.callee, _core().types.identifier("call"));
        node.arguments.unshift(context);
      },

      BindExpression(path) {
        const {
          node,
          scope
        } = path;
        const context = inferBindContext(node, scope);
        path.replaceWith(_core().types.callExpression(_core().types.memberExpression(node.callee, _core().types.identifier("bind")), [context]));
      }

    }
  };
});

exports.default = _default;