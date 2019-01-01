"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _helperBindifyDecorators() {
  const data = _interopRequireDefault(require("babylonia/helper-bindify-decorators"));

  _helperBindifyDecorators = function () {
    return data;
  };

  return data;
}

function t() {
  const data = _interopRequireWildcard(require("babylonia/types"));

  t = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(classPath) {
  classPath.assertClass();
  const memoisedExpressions = [];

  function maybeMemoise(path) {
    if (!path.node || path.isPure()) return;
    const uid = classPath.scope.generateDeclaredUidIdentifier();
    memoisedExpressions.push(t().assignmentExpression("=", uid, path.node));
    path.replaceWith(uid);
  }

  function memoiseDecorators(paths) {
    if (!Array.isArray(paths) || !paths.length) return;
    paths = paths.reverse();
    (0, _helperBindifyDecorators().default)(paths);

    for (const path of paths) {
      maybeMemoise(path);
    }
  }

  maybeMemoise(classPath.get("superClass"));
  memoiseDecorators(classPath.get("decorators"), true);
  const methods = classPath.get("body.body");

  for (const methodPath of methods) {
    if (methodPath.is("computed")) {
      maybeMemoise(methodPath.get("key"));
    }

    if (methodPath.has("decorators")) {
      memoiseDecorators(classPath.get("decorators"));
    }
  }

  if (memoisedExpressions) {
    classPath.insertBefore(memoisedExpressions.map(expr => t().expressionStatement(expr)));
  }
}