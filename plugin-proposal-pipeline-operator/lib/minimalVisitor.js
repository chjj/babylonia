"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("babylonia/core");
var _buildOptimizedSequenceExpression = require("./buildOptimizedSequenceExpression.js");
const minimalVisitor = {
  BinaryExpression(path) {
    const {
      scope,
      node
    } = path;
    const {
      operator,
      left,
      right
    } = node;
    if (operator !== "|>") return;
    const placeholder = scope.generateUidIdentifierBasedOnNode(left);
    const call = _core.types.callExpression(right, [_core.types.cloneNode(placeholder)]);
    path.replaceWith((0, _buildOptimizedSequenceExpression.default)({
      placeholder,
      call,
      path: path
    }));
  }
};
var _default = exports.default = minimalVisitor;

//# sourceMappingURL=minimalVisitor.js.map
