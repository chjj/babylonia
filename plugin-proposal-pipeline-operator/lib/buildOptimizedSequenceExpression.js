"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("babylonia/core");
function isConciseArrowExpression(node) {
  return _core.types.isArrowFunctionExpression(node) && _core.types.isExpression(node.body) && !node.async;
}
const buildOptimizedSequenceExpression = ({
  call,
  path,
  placeholder
}) => {
  const {
    callee: calledExpression
  } = call;
  const pipelineLeft = path.node.left;
  const assign = _core.types.assignmentExpression("=", _core.types.cloneNode(placeholder), pipelineLeft);
  const expressionIsArrow = isConciseArrowExpression(calledExpression);
  if (expressionIsArrow) {
    let param;
    let optimizeArrow = true;
    const {
      params
    } = calledExpression;
    if (params.length === 1 && _core.types.isIdentifier(params[0])) {
      param = params[0];
    } else if (params.length > 0) {
      optimizeArrow = false;
    }
    if (optimizeArrow && !param) {
      return _core.types.sequenceExpression([pipelineLeft, calledExpression.body]);
    } else if (param) {
      path.scope.push({
        id: _core.types.cloneNode(placeholder)
      });
      path.get("right").scope.rename(param.name, placeholder.name);
      return _core.types.sequenceExpression([assign, calledExpression.body]);
    }
  } else if (_core.types.isIdentifier(calledExpression, {
    name: "eval"
  })) {
    const evalSequence = _core.types.sequenceExpression([_core.types.numericLiteral(0), calledExpression]);
    call.callee = evalSequence;
  }
  path.scope.push({
    id: _core.types.cloneNode(placeholder)
  });
  return _core.types.sequenceExpression([assign, call]);
};
var _default = exports.default = buildOptimizedSequenceExpression;

//# sourceMappingURL=buildOptimizedSequenceExpression.js.map
