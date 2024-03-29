"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxPartialApplication = require("babylonia/plugin-syntax-partial-application");
var _core = require("babylonia/core");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  function hasArgumentPlaceholder(node) {
    return node.arguments.some(arg => _core.types.isArgumentPlaceholder(arg));
  }
  function unwrapArguments({
    arguments: args
  }, scope) {
    const init = [];
    for (let i = 0; i < args.length; i++) {
      const node = args[i];
      if (!_core.types.isArgumentPlaceholder(node) && !_core.types.isImmutable(node)) {
        const id = scope.generateUidIdentifierBasedOnNode(node, "param");
        scope.push({
          id
        });
        if (_core.types.isSpreadElement(node)) {
          init.push(_core.types.assignmentExpression("=", _core.types.cloneNode(id), _core.types.arrayExpression([_core.types.spreadElement(node.argument)])));
          node.argument = _core.types.cloneNode(id);
        } else {
          init.push(_core.types.assignmentExpression("=", _core.types.cloneNode(id), node));
          args[i] = _core.types.cloneNode(id);
        }
      }
    }
    return init;
  }
  function replacePlaceholders(node, scope) {
    const placeholders = [];
    const newArgs = [];
    node.arguments.forEach(arg => {
      if (_core.types.isArgumentPlaceholder(arg)) {
        const id = scope.generateUid("_argPlaceholder");
        placeholders.push(_core.types.identifier(id));
        newArgs.push(_core.types.identifier(id));
      } else {
        newArgs.push(arg);
      }
    });
    return [placeholders, newArgs];
  }
  return {
    name: "proposal-partial-application",
    inherits: _pluginSyntaxPartialApplication.default,
    visitor: {
      CallExpression(path) {
        if (!hasArgumentPlaceholder(path.node)) {
          return;
        }
        const {
          node,
          scope
        } = path;
        const functionLVal = path.scope.generateUidIdentifierBasedOnNode(node.callee);
        const sequenceParts = [];
        const argsInitializers = unwrapArguments(node, scope);
        const [placeholdersParams, args] = replacePlaceholders(node, scope);
        scope.push({
          id: functionLVal
        });
        if (node.callee.type === "MemberExpression") {
          const {
            object: receiver,
            property
          } = node.callee;
          const receiverLVal = path.scope.generateUidIdentifierBasedOnNode(receiver);
          scope.push({
            id: receiverLVal
          });
          sequenceParts.push(_core.types.assignmentExpression("=", _core.types.cloneNode(receiverLVal), receiver), _core.types.assignmentExpression("=", _core.types.cloneNode(functionLVal), _core.types.memberExpression(_core.types.cloneNode(receiverLVal), property)), ...argsInitializers, _core.types.functionExpression(_core.types.isIdentifier(property) ? _core.types.cloneNode(property) : path.scope.generateUidIdentifierBasedOnNode(property), placeholdersParams, _core.types.blockStatement([_core.types.returnStatement(_core.types.callExpression(_core.types.memberExpression(_core.types.cloneNode(functionLVal), _core.types.identifier("call")), [_core.types.cloneNode(receiverLVal), ...args]))], []), false, false));
        } else {
          sequenceParts.push(_core.types.assignmentExpression("=", _core.types.cloneNode(functionLVal), node.callee), ...argsInitializers, _core.types.functionExpression(_core.types.isIdentifier(node.callee) ? _core.types.cloneNode(node.callee) : path.scope.generateUidIdentifierBasedOnNode(node.callee), placeholdersParams, _core.types.blockStatement([_core.types.returnStatement(_core.types.callExpression(_core.types.cloneNode(functionLVal), args))], []), false, false));
        }
        path.replaceWith(_core.types.sequenceExpression(sequenceParts));
      }
    }
  };
});

//# sourceMappingURL=index.js.map
