"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("babylonia/core");
var _buildOptimizedSequenceExpression = require("./buildOptimizedSequenceExpression.js");
const fsharpVisitor = {
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
    const call = right.type === "AwaitExpression" ? _core.types.awaitExpression(_core.types.cloneNode(placeholder)) : _core.types.callExpression(right, [_core.types.cloneNode(placeholder)]);
    const sequence = (0, _buildOptimizedSequenceExpression.default)({
      placeholder,
      call,
      path: path
    });
    path.replaceWith(sequence);
  }
};
var _default = exports.default = fsharpVisitor;

//# sourceMappingURL=fsharpVisitor.js.map
