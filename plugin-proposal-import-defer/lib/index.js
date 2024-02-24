"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginTransformModulesCommonjs = require("babylonia/plugin-transform-modules-commonjs");
var _pluginSyntaxImportDefer = require("babylonia/plugin-syntax-import-defer");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion("^7.23.0");
  const t = api.types;
  const {
    template
  } = api;
  function allReferencesAreProps(scope, node) {
    const specifier = node.specifiers[0];
    t.assertImportNamespaceSpecifier(specifier);
    const binding = scope.getOwnBinding(specifier.local.name);
    return !!(binding != null && binding.referencePaths.every(path => path.parentPath.isMemberExpression({
      object: path.node
    })));
  }
  return {
    name: "proposal-import-defer",
    inherits: _pluginSyntaxImportDefer.default,
    pre() {
      const {
        file
      } = this;
      (0, _pluginTransformModulesCommonjs.defineCommonJSHook)(file, {
        name: "babylonia/plugin-proposal-import-defer",
        version: "7.23.7",
        getWrapperPayload(source, metadata, importNodes) {
          let needsProxy = false;
          for (const node of importNodes) {
            if (!t.isImportDeclaration(node)) return null;
            if (node.phase !== "defer") return null;
            if (!allReferencesAreProps(file.scope, node)) needsProxy = true;
          }
          return needsProxy ? "defer/proxy" : "defer/function";
        },
        buildRequireWrapper(name, init, payload, referenced) {
          if (payload === "defer/proxy") {
            if (!referenced) return false;
            return template.statement.ast`
              var ${name} = ${file.addHelper("importDeferProxy")}(
                () => ${init}
              )
            `;
          }
          if (payload === "defer/function") {
            if (!referenced) return false;
            return template.statement.ast`
              function ${name}(data) {
                ${name} = () => data;
                return data = ${init};
              }
            `;
          }
        },
        wrapReference(ref, payload) {
          if (payload === "defer/function") return t.callExpression(ref, []);
        }
      });
    },
    visitor: {
      Program(path) {
        if (this.file.get("babylonia/plugin-transform-modules-*") !== "commonjs") {
          throw new Error(`babylonia/plugin-proposal-import-defer can only be used when` + ` transpiling modules to CommonJS.`);
        }
        const eagerImports = new Set();
        for (const child of path.get("body")) {
          if (child.isImportDeclaration() && child.node.phase == null || child.isExportNamedDeclaration() && child.node.source !== null || child.isExportAllDeclaration()) {
            const specifier = child.node.source.value;
            if (!eagerImports.has(specifier)) {
              eagerImports.add(specifier);
            }
          }
        }
        const importsToPush = [];
        for (const child of path.get("body")) {
          if (child.isImportDeclaration({
            phase: "defer"
          })) {
            const specifier = child.node.source.value;
            if (!eagerImports.has(specifier)) continue;
            child.node.phase = null;
            importsToPush.push(child.node);
            child.remove();
          }
        }
        if (importsToPush.length) {
          path.pushContainer("body", importsToPush);
          path.scope.crawl();
        }
      }
    }
  };
});

//# sourceMappingURL=index.js.map
