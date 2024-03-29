"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxOptionalChainingAssign = require("babylonia/plugin-syntax-optional-chaining-assign");
var _helperSkipTransparentExpressionWrappers = require("babylonia/helper-skip-transparent-expression-wrappers");
var _pluginTransformOptionalChaining = require("babylonia/plugin-transform-optional-chaining");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  var _api$assumption, _api$assumption2;
  api.assertVersion("^7.22.5");
  const assumptions = {
    noDocumentAll: (_api$assumption = api.assumption("noDocumentAll")) != null ? _api$assumption : false,
    pureGetters: (_api$assumption2 = api.assumption("pureGetters")) != null ? _api$assumption2 : false
  };
  const {
    types: t
  } = api;
  return {
    name: "transform-optional-chaining-assign",
    inherits: _pluginSyntaxOptionalChainingAssign.default,
    visitor: {
      AssignmentExpression(path, state) {
        var _lhs$node$extra;
        let lhs = path.get("left");
        if (!lhs.isExpression()) return;
        const isParenthesized = ((_lhs$node$extra = lhs.node.extra) == null ? void 0 : _lhs$node$extra.parenthesized) || t.isParenthesizedExpression(lhs.node);
        lhs = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(lhs);
        if (!lhs.isOptionalMemberExpression()) return;
        let ifNullish = path.scope.buildUndefinedNode();
        if (isParenthesized) {
          ifNullish = t.callExpression(state.addHelper("nullishReceiverError"), []);
          if (path.node.operator === "=") {
            ifNullish = t.sequenceExpression([t.cloneNode(path.node.right), ifNullish]);
          }
        }
        (0, _pluginTransformOptionalChaining.transformOptionalChain)(lhs, assumptions, path, ifNullish);
      }
    }
  };
});

//# sourceMappingURL=index.js.map
