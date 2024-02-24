'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helperPluginUtils = require('@babel/helper-plugin-utils');
var syntaxDestructuringPrivate = require('@babel/plugin-syntax-destructuring-private');
var core = require('@babel/core');
var pluginTransformDestructuring = require('@babel/plugin-transform-destructuring');
var pluginTransformParameters = require('@babel/plugin-transform-parameters');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var syntaxDestructuringPrivate__default = /*#__PURE__*/_interopDefault(syntaxDestructuringPrivate);

const {
  assignmentExpression,
  binaryExpression,
  conditionalExpression,
  cloneNode,
  isObjectProperty,
  isPrivateName,
  memberExpression,
  numericLiteral,
  objectPattern,
  restElement,
  variableDeclarator,
  variableDeclaration,
  unaryExpression
} = core.types;
function buildUndefinedNode() {
  return unaryExpression("void", numericLiteral(0));
}
function transformAssignmentPattern(initializer, tempId) {
  return conditionalExpression(binaryExpression("===", cloneNode(tempId), buildUndefinedNode()), initializer, cloneNode(tempId));
}
function initRestExcludingKeys(pattern) {
  if (pattern.type === "ObjectPattern") {
    const {
      properties
    } = pattern;
    if (properties[properties.length - 1].type === "RestElement") {
      return [];
    }
  }
  return null;
}
function growRestExcludingKeys(excludingKeys, properties, scope) {
  if (excludingKeys === null) return;
  for (const property of properties) {
    const propertyKey = property.key;
    if (property.computed && !scope.isStatic(propertyKey)) {
      const tempId = scope.generateDeclaredUidIdentifier("m");
      property.key = assignmentExpression("=", tempId, propertyKey);
      excludingKeys.push({
        key: tempId,
        computed: true
      });
    } else if (propertyKey.type !== "PrivateName") {
      excludingKeys.push(property);
    }
  }
}
function buildVariableDeclarationFromParams(params, scope) {
  const {
    elements,
    transformed
  } = buildAssignmentsFromPatternList(params, scope, false);
  return {
    params: elements,
    variableDeclaration: variableDeclaration("var", transformed.map(({
      left,
      right
    }) => variableDeclarator(left, right)))
  };
}
function buildAssignmentsFromPatternList(elements, scope, isAssignment) {
  const newElements = [],
    transformed = [];
  for (let element of elements) {
    if (element === null) {
      newElements.push(null);
      transformed.push(null);
      continue;
    }
    const tempId = scope.generateUidIdentifier("p");
    if (isAssignment) {
      scope.push({
        id: cloneNode(tempId)
      });
    }
    if (element.type === "RestElement") {
      newElements.push(restElement(tempId));
      element = element.argument;
    } else {
      newElements.push(tempId);
    }
    if (element.type === "AssignmentPattern") {
      transformed.push({
        left: element.left,
        right: transformAssignmentPattern(element.right, tempId)
      });
    } else {
      transformed.push({
        left: element,
        right: cloneNode(tempId)
      });
    }
  }
  return {
    elements: newElements,
    transformed
  };
}
function* traversePattern(root, visitor) {
  const stack = [];
  stack.push({
    node: root,
    index: 0,
    depth: 0
  });
  let item;
  while ((item = stack.pop()) !== undefined) {
    const {
      node,
      index
    } = item;
    if (node === null) continue;
    yield* visitor(node, index, item.depth);
    const depth = item.depth + 1;
    switch (node.type) {
      case "AssignmentPattern":
        stack.push({
          node: node.left,
          index: 0,
          depth
        });
        break;
      case "ObjectProperty":
        stack.push({
          node: node.value,
          index,
          depth: item.depth
        });
        break;
      case "RestElement":
        stack.push({
          node: node.argument,
          index: 0,
          depth
        });
        break;
      case "ObjectPattern":
        for (let list = node.properties, i = list.length - 1; i >= 0; i--) {
          stack.push({
            node: list[i],
            index: i,
            depth
          });
        }
        break;
      case "ArrayPattern":
        for (let list = node.elements, i = list.length - 1; i >= 0; i--) {
          stack.push({
            node: list[i],
            index: i,
            depth
          });
        }
        break;
      case "TSParameterProperty":
      case "TSAsExpression":
      case "TSTypeAssertion":
      case "TSNonNullExpression":
        throw new Error(`TypeScript features must first be transformed by ` + `@babel/plugin-transform-typescript.\n` + `If you have already enabled that plugin (or '@babel/preset-typescript'), make sure ` + `that it runs before @babel/plugin-proposal-destructuring-private.`);
    }
  }
}
function hasPrivateKeys(pattern) {
  let result = false;
  traversePattern(pattern, function* (node) {
    if (isObjectProperty(node) && isPrivateName(node.key)) {
      result = true;
      yield;
    }
  }).next();
  return result;
}
function hasPrivateClassElement(node) {
  return node.body.some(element => isPrivateName(element.key));
}
function* privateKeyPathIterator(pattern) {
  const indexPath = [];
  yield* traversePattern(pattern, function* (node, index, depth) {
    indexPath[depth] = index;
    if (isObjectProperty(node) && isPrivateName(node.key)) {
      yield indexPath.slice(1, depth + 1);
    }
  });
}
function rightWillBeReferencedOnce(left) {
  switch (left.type) {
    case "Identifier":
    case "ArrayPattern":
      return true;
    case "ObjectPattern":
      return left.properties.length === 1;
    default:
      return false;
  }
}
function* transformPrivateKeyDestructuring(left, right, scope, isAssignment, shouldPreserveCompletion, addHelper, objectRestNoSymbols, useBuiltIns) {
  const stack = [];
  const rootRight = right;
  stack.push({
    left,
    right,
    restExcludingKeys: initRestExcludingKeys(left)
  });
  let item;
  while ((item = stack.pop()) !== undefined) {
    const {
      restExcludingKeys
    } = item;
    let {
      left,
      right
    } = item;
    const searchPrivateKey = privateKeyPathIterator(left).next();
    if (searchPrivateKey.done) {
      if ((restExcludingKeys == null ? void 0 : restExcludingKeys.length) > 0) {
        const {
          properties
        } = left;
        if (properties.length === 1) {
          left = properties[0].argument;
        }
        yield {
          left: left,
          right: pluginTransformDestructuring.buildObjectExcludingKeys(restExcludingKeys, right, scope, addHelper, objectRestNoSymbols, useBuiltIns)
        };
      } else {
        yield {
          left: left,
          right
        };
      }
    } else {
      const indexPath = searchPrivateKey.value;
      for (let indexPathIndex = 0, index; indexPathIndex < indexPath.length && (index = indexPath[indexPathIndex]) !== undefined || left.type === "AssignmentPattern"; indexPathIndex++) {
        const isRightSafeToReuse = !(shouldPreserveCompletion && right === rootRight) && (rightWillBeReferencedOnce(left) || scope.isStatic(right));
        if (!isRightSafeToReuse) {
          const tempId = scope.generateUidIdentifier("m");
          if (isAssignment) {
            scope.push({
              id: cloneNode(tempId)
            });
          }
          yield {
            left: tempId,
            right
          };
          right = cloneNode(tempId);
        }
        switch (left.type) {
          case "ObjectPattern":
            {
              const {
                properties
              } = left;
              if (index > 0) {
                const propertiesSlice = properties.slice(0, index);
                yield {
                  left: objectPattern(propertiesSlice),
                  right: cloneNode(right)
                };
              }
              if (index < properties.length - 1) {
                const nextRestExcludingKeys = indexPathIndex === 0 ? restExcludingKeys : initRestExcludingKeys(left);
                growRestExcludingKeys(nextRestExcludingKeys, properties.slice(0, index + 1), scope);
                stack.push({
                  left: objectPattern(properties.slice(index + 1)),
                  right: cloneNode(right),
                  restExcludingKeys: nextRestExcludingKeys
                });
              }
              const property = properties[index];
              left = property.value;
              const {
                key
              } = property;
              const computed = property.computed || key.type !== "Identifier" && key.type !== "PrivateName";
              right = memberExpression(right, key, computed);
              break;
            }
          case "AssignmentPattern":
            {
              right = transformAssignmentPattern(left.right, right);
              left = left.left;
              break;
            }
          case "ArrayPattern":
            {
              const leftElements = left.elements;
              const leftElementsAfterIndex = leftElements.splice(index);
              const {
                elements,
                transformed
              } = buildAssignmentsFromPatternList(leftElementsAfterIndex, scope, isAssignment);
              leftElements.push(...elements);
              yield {
                left,
                right: cloneNode(right)
              };
              for (let i = transformed.length - 1; i > 0; i--) {
                if (transformed[i] !== null) {
                  stack.push(transformed[i]);
                }
              }
              ({
                left,
                right
              } = transformed[0]);
              break;
            }
        }
      }
      stack.push({
        left,
        right,
        restExcludingKeys: initRestExcludingKeys(left)
      });
    }
  }
}

var index = helperPluginUtils.declare(function ({
  assertVersion,
  assumption,
  types: t
}) {
  assertVersion("^7.17.0");
  const {
    assignmentExpression,
    assignmentPattern,
    cloneNode,
    expressionStatement,
    isExpressionStatement,
    isIdentifier,
    isSequenceExpression,
    sequenceExpression,
    variableDeclaration,
    variableDeclarator
  } = t;
  const ignoreFunctionLength = assumption("ignoreFunctionLength");
  const objectRestNoSymbols = assumption("objectRestNoSymbols");
  const privateKeyDestructuringVisitor = {
    Function(path) {
      const firstPrivateIndex = path.node.params.findIndex(param => hasPrivateKeys(param));
      if (firstPrivateIndex === -1) return;
      pluginTransformParameters.convertFunctionParams(path, ignoreFunctionLength, () => false);
      const {
        node,
        scope
      } = path;
      const {
        params
      } = node;
      const firstAssignmentPatternIndex = ignoreFunctionLength ? -1 : params.findIndex(param => param.type === "AssignmentPattern");
      const paramsAfterIndex = params.splice(firstPrivateIndex);
      const {
        params: transformedParams,
        variableDeclaration
      } = buildVariableDeclarationFromParams(paramsAfterIndex, scope);
      path.get("body").unshiftContainer("body", variableDeclaration);
      params.push(...transformedParams);
      if (firstAssignmentPatternIndex >= firstPrivateIndex) {
        params[firstAssignmentPatternIndex] = assignmentPattern(params[firstAssignmentPatternIndex], scope.buildUndefinedNode());
      }
      scope.crawl();
    },
    CatchClause(path) {
      const {
        node,
        scope
      } = path;
      if (!hasPrivateKeys(node.param)) return;
      const ref = scope.generateUidIdentifier("e");
      path.get("body").unshiftContainer("body", variableDeclaration("let", [variableDeclarator(node.param, ref)]));
      node.param = cloneNode(ref);
      scope.crawl();
    },
    ForXStatement(path) {
      const {
        node,
        scope
      } = path;
      const leftPath = path.get("left");
      if (leftPath.isVariableDeclaration()) {
        const left = leftPath.node;
        if (!hasPrivateKeys(left.declarations[0].id)) return;
        const temp = scope.generateUidIdentifier("ref");
        node.left = variableDeclaration(left.kind, [variableDeclarator(temp, null)]);
        left.declarations[0].init = cloneNode(temp);
        pluginTransformDestructuring.unshiftForXStatementBody(path, [left]);
        scope.crawl();
      } else if (leftPath.isPattern()) {
        if (!hasPrivateKeys(leftPath.node)) return;
        const temp = scope.generateUidIdentifier("ref");
        node.left = variableDeclaration("const", [variableDeclarator(temp, null)]);
        const assignExpr = expressionStatement(assignmentExpression("=", leftPath.node, cloneNode(temp)));
        pluginTransformDestructuring.unshiftForXStatementBody(path, [assignExpr]);
        scope.crawl();
      }
    },
    VariableDeclaration(path, state) {
      const {
        scope,
        node
      } = path;
      const {
        declarations
      } = node;
      if (!declarations.some(declarator => hasPrivateKeys(declarator.id))) {
        return;
      }
      const newDeclarations = [];
      for (const declarator of declarations) {
        for (const {
          left,
          right
        } of transformPrivateKeyDestructuring(declarator.id, declarator.init, scope, false, false, name => state.addHelper(name), objectRestNoSymbols, true)) {
          newDeclarations.push(variableDeclarator(left, right));
        }
      }
      node.declarations = newDeclarations;
      scope.crawl();
    },
    AssignmentExpression(path, state) {
      const {
        node,
        scope,
        parent
      } = path;
      if (!hasPrivateKeys(node.left)) return;
      const assignments = [];
      const shouldPreserveCompletion = !isExpressionStatement(parent) && !isSequenceExpression(parent) || path.isCompletionRecord();
      for (const {
        left,
        right
      } of transformPrivateKeyDestructuring(node.left, node.right, scope, true, shouldPreserveCompletion, name => state.addHelper(name), objectRestNoSymbols, true)) {
        assignments.push(assignmentExpression("=", left, right));
      }
      if (shouldPreserveCompletion) {
        const {
          left,
          right
        } = assignments[0];
        if (isIdentifier(left) && right === node.right) {
          if (!isIdentifier(assignments[assignments.length - 1].right, {
            name: left.name
          })) {
            assignments.push(cloneNode(left));
          }
        } else {
          const tempId = scope.generateDeclaredUidIdentifier("m");
          assignments.unshift(assignmentExpression("=", tempId, cloneNode(node.right)));
          assignments.push(cloneNode(tempId));
        }
      }
      path.replaceWith(sequenceExpression(assignments));
      scope.crawl();
    }
  };
  const visitor = {
    Class(path, state) {
      if (!hasPrivateClassElement(path.node.body)) return;
      path.traverse(privateKeyDestructuringVisitor, state);
    }
  };
  return {
    name: "proposal-destructuring-private",
    inherits: syntaxDestructuringPrivate__default.default,
    visitor: visitor
  };
});

exports.default = index;
//# sourceMappingURL=index.js.map
