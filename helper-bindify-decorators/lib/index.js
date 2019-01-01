"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindifyDecorators;

function t() {
  const data = _interopRequireWildcard(require("babylonia/types"));

  t = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function bindifyDecorators(decorators) {
  for (const decoratorPath of decorators) {
    const decorator = decoratorPath.node;
    const expression = decorator.expression;
    if (!t().isMemberExpression(expression)) continue;
    const temp = decoratorPath.scope.maybeGenerateMemoised(expression.object);
    let ref;
    const nodes = [];

    if (temp) {
      ref = temp;
      nodes.push(t().assignmentExpression("=", temp, expression.object));
    } else {
      ref = expression.object;
    }

    nodes.push(t().callExpression(t().memberExpression(t().memberExpression(ref, expression.property, expression.computed), t().identifier("bind")), [ref]));

    if (nodes.length === 1) {
      decorator.expression = nodes[0];
    } else {
      decorator.expression = t().sequenceExpression(nodes);
    }
  }
}