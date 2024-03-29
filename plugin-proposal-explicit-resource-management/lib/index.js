"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxExplicitResourceManagement = require("babylonia/plugin-syntax-explicit-resource-management");
var _core = require("babylonia/core");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion("^7.22.0");
  const TOP_LEVEL_USING = new Map();
  function isUsingDeclaration(node) {
    if (!_core.types.isVariableDeclaration(node)) return false;
    return node.kind === "using" || node.kind === "await using" || TOP_LEVEL_USING.has(node);
  }
  const transformUsingDeclarationsVisitor = {
    ForOfStatement(path) {
      const {
        left
      } = path.node;
      if (!isUsingDeclaration(left)) return;
      const {
        id
      } = left.declarations[0];
      const tmpId = path.scope.generateUidIdentifierBasedOnNode(id);
      left.declarations[0].id = tmpId;
      left.kind = "const";
      path.ensureBlock();
      path.node.body.body.unshift(_core.types.variableDeclaration("using", [_core.types.variableDeclarator(id, _core.types.cloneNode(tmpId))]));
    },
    "BlockStatement|StaticBlock"(path, state) {
      if (state.availableHelper("usingCtx")) {
        let ctx = null;
        let needsAwait = false;
        for (const node of path.node.body) {
          var _ctx;
          if (!isUsingDeclaration(node)) continue;
          (_ctx = ctx) != null ? _ctx : ctx = path.scope.generateUidIdentifier("usingCtx");
          const isAwaitUsing = node.kind === "await using" || TOP_LEVEL_USING.get(node) === 1;
          needsAwait || (needsAwait = isAwaitUsing);
          if (!TOP_LEVEL_USING.delete(node)) {
            node.kind = "const";
          }
          for (const decl of node.declarations) {
            decl.init = _core.types.callExpression(_core.types.memberExpression(_core.types.cloneNode(ctx), isAwaitUsing ? _core.types.identifier("a") : _core.types.identifier("u")), [decl.init]);
          }
        }
        if (!ctx) return;
        const disposeCall = _core.types.callExpression(_core.types.memberExpression(_core.types.cloneNode(ctx), _core.types.identifier("d")), []);
        const replacement = _core.template.statement.ast`
        try {
          var ${_core.types.cloneNode(ctx)} = ${state.addHelper("usingCtx")}();
          ${path.node.body}
        } catch (_) {
          ${_core.types.cloneNode(ctx)}.e = _;
        } finally {
          ${needsAwait ? _core.types.awaitExpression(disposeCall) : disposeCall}
        }
      `;
        _core.types.inherits(replacement, path.node);
        const {
          parentPath
        } = path;
        if (parentPath.isFunction() || parentPath.isTryStatement() || parentPath.isCatchClause()) {
          path.replaceWith(_core.types.blockStatement([replacement]));
        } else if (path.isStaticBlock()) {
          path.node.body = [replacement];
        } else {
          path.replaceWith(replacement);
        }
      } else {
        let stackId = null;
        let needsAwait = false;
        for (const node of path.node.body) {
          var _stackId;
          if (!isUsingDeclaration(node)) continue;
          (_stackId = stackId) != null ? _stackId : stackId = path.scope.generateUidIdentifier("stack");
          const isAwaitUsing = node.kind === "await using" || TOP_LEVEL_USING.get(node) === 1;
          needsAwait || (needsAwait = isAwaitUsing);
          if (!TOP_LEVEL_USING.delete(node)) {
            node.kind = "const";
          }
          node.declarations.forEach(decl => {
            const args = [_core.types.cloneNode(stackId), decl.init];
            if (isAwaitUsing) args.push(_core.types.booleanLiteral(true));
            decl.init = _core.types.callExpression(state.addHelper("using"), args);
          });
        }
        if (!stackId) return;
        const errorId = path.scope.generateUidIdentifier("error");
        const hasErrorId = path.scope.generateUidIdentifier("hasError");
        let disposeCall = _core.types.callExpression(state.addHelper("dispose"), [_core.types.cloneNode(stackId), _core.types.cloneNode(errorId), _core.types.cloneNode(hasErrorId)]);
        if (needsAwait) disposeCall = _core.types.awaitExpression(disposeCall);
        const replacement = _core.template.statement.ast`
        try {
          var ${stackId} = [];
          ${path.node.body}
        } catch (_) {
          var ${errorId} = _;
          var ${hasErrorId} = true;
        } finally {
          ${disposeCall}
        }
      `;
        _core.types.inherits(replacement.block, path.node);
        const {
          parentPath
        } = path;
        if (parentPath.isFunction() || parentPath.isTryStatement() || parentPath.isCatchClause()) {
          path.replaceWith(_core.types.blockStatement([replacement]));
        } else if (path.isStaticBlock()) {
          path.node.body = [replacement];
        } else {
          path.replaceWith(replacement);
        }
      }
    }
  };
  const transformUsingDeclarationsVisitorSkipFn = _core.traverse.visitors.merge([transformUsingDeclarationsVisitor, {
    Function(path) {
      path.skip();
    }
  }]);
  return {
    name: "proposal-explicit-resource-management",
    inherits: _pluginSyntaxExplicitResourceManagement.default,
    visitor: _core.traverse.visitors.merge([transformUsingDeclarationsVisitor, {
      Program(path) {
        TOP_LEVEL_USING.clear();
        if (path.node.sourceType !== "module") return;
        if (!path.node.body.some(isUsingDeclaration)) return;
        const innerBlockBody = [];
        for (const stmt of path.get("body")) {
          if (stmt.isFunctionDeclaration() || stmt.isImportDeclaration()) {
            continue;
          }
          let {
            node
          } = stmt;
          let shouldRemove = true;
          if (stmt.isExportDefaultDeclaration()) {
            var _varId;
            let {
              declaration
            } = stmt.node;
            let varId;
            if (_core.types.isClassDeclaration(declaration)) {
              varId = declaration.id;
              declaration.id = null;
              declaration = _core.types.toExpression(declaration);
            } else if (!_core.types.isExpression(declaration)) {
              continue;
            }
            (_varId = varId) != null ? _varId : varId = path.scope.generateUidIdentifier("_default");
            innerBlockBody.push(_core.types.variableDeclaration("var", [_core.types.variableDeclarator(varId, declaration)]));
            stmt.replaceWith(_core.types.exportNamedDeclaration(null, [_core.types.exportSpecifier(_core.types.cloneNode(varId), _core.types.identifier("default"))]));
            continue;
          }
          if (stmt.isExportNamedDeclaration()) {
            node = stmt.node.declaration;
            if (!node || _core.types.isFunction(node)) continue;
            stmt.replaceWith(_core.types.exportNamedDeclaration(null, Object.keys(_core.types.getOuterBindingIdentifiers(node, false)).map(id => _core.types.exportSpecifier(_core.types.identifier(id), _core.types.identifier(id)))));
            shouldRemove = false;
          } else if (stmt.isExportDeclaration()) {
            continue;
          }
          if (_core.types.isClassDeclaration(node)) {
            const {
              id
            } = node;
            node.id = null;
            innerBlockBody.push(_core.types.variableDeclaration("var", [_core.types.variableDeclarator(id, _core.types.toExpression(node))]));
          } else if (_core.types.isVariableDeclaration(node)) {
            if (node.kind === "using") {
              TOP_LEVEL_USING.set(stmt.node, 0);
            } else if (node.kind === "await using") {
              TOP_LEVEL_USING.set(stmt.node, 1);
            }
            node.kind = "var";
            innerBlockBody.push(node);
          } else {
            innerBlockBody.push(stmt.node);
          }
          if (shouldRemove) stmt.remove();
        }
        path.pushContainer("body", _core.types.blockStatement(innerBlockBody));
      },
      Function(path, state) {
        if (path.node.async) {
          path.traverse(transformUsingDeclarationsVisitorSkipFn, state);
        }
      }
    }])
  };
});

//# sourceMappingURL=index.js.map
