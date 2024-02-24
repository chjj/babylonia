"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _helperModuleImports = require("babylonia/helper-module-imports");
var _helperCompilationTargets = require("babylonia/helper-compilation-targets");
var _pluginSyntaxImportSource = require("babylonia/plugin-syntax-import-source");
const _excluded = ["node"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const imrCompatData = {
  compatData: {
    web: {
      chrome: "105.0.0",
      edge: "105.0.0",
      firefox: "106.0.0",
      opera: "91.0.0",
      safari: "16.4.0",
      opera_mobile: "72.0.0",
      ios: "16.4.0",
      samsung: "20.0",
      deno: "1.24.0"
    },
    node: {
      node: "20.6.0"
    }
  }
};
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function imp(path, name, module) {
  return (0, _helperModuleImports.addNamed)(path, name, module, {
    importedType: "es6"
  });
}
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  const {
    types: t,
    template
  } = api;
  api.assertVersion("^7.23.0");
  const _api$targets = api.targets(),
    {
      node: nodeTarget
    } = _api$targets,
    webTargets = _objectWithoutPropertiesLoose(_api$targets, _excluded);
  const emptyNodeTarget = nodeTarget == null;
  const emptyWebTargets = isEmpty(webTargets);
  const needsNodeSupport = !emptyNodeTarget || emptyWebTargets;
  const needsWebSupport = !emptyWebTargets || emptyNodeTarget;
  const nodeSupportsIMR = !emptyNodeTarget && !(0, _helperCompilationTargets.isRequired)("node", {
    node: nodeTarget
  }, imrCompatData);
  const webSupportsIMR = !emptyWebTargets && !(0, _helperCompilationTargets.isRequired)("web", webTargets, imrCompatData);
  let helperESM;
  let helperCJS;
  const getHelper = file => {
    const modules = file.get("babylonia/plugin-transform-modules-*");
    if (modules === "commonjs") {
      var _helperCJS;
      return (_helperCJS = helperCJS) != null ? _helperCJS : helperCJS = buildHelper(true);
    }
    if (modules == null) {
      var _helperESM;
      return (_helperESM = helperESM) != null ? _helperESM : helperESM = buildHelper(false);
    }
    throw new Error(`babylonia/plugin-proposal-import-wasm-source can only be used when not ` + `compiling modules, or when compiling them to CommonJS.`);
  };
  return {
    name: "proposal-import-wasm-source",
    inherits: _pluginSyntaxImportSource.default,
    visitor: {
      Program(path) {
        if (path.node.sourceType !== "module") return;
        const helper = getHelper(this.file);
        const t2 = t;
        const ids = [];
        const fetches = [];
        for (const decl of path.get("body")) {
          var _decl$node$attributes, _decl$node$assertions;
          if (!decl.isImportDeclaration({
            phase: "source"
          })) continue;
          if ((_decl$node$attributes = decl.node.attributes) != null && _decl$node$attributes.length || (_decl$node$assertions = decl.node.assertions) != null && _decl$node$assertions.length) {
            throw path.buildCodeFrameError("`import source` with import attributes cannot be compiled.");
          }
          const specifier = decl.node.specifiers[0];
          t2.assertImportDefaultSpecifier(specifier);
          ids.push(specifier.local);
          fetches.push(helper.buildFetch(decl.node.source, path));
          decl.remove();
        }
        if (ids.length === 0) return;
        const declarators = [];
        if (ids.length === 1) {
          let rhs = fetches[0];
          if (helper.needsAwait) rhs = t.awaitExpression(rhs);
          declarators.push(t.variableDeclarator(ids[0], rhs));
        } else if (helper.needsAwait) {
          declarators.push(t.variableDeclarator(t.arrayPattern(ids), t.awaitExpression(template.expression.ast`
                  Promise.all(${t.arrayExpression(fetches)})
                `)));
        } else {
          for (let i = 0; i < ids.length; i++) {
            declarators.push(t.variableDeclarator(ids[i], fetches[i]));
          }
        }
        path.unshiftContainer("body", t.variableDeclaration("const", declarators));
      },
      ImportExpression(path) {
        if (path.node.phase !== "source") return;
        if (path.node.options) {
          throw path.buildCodeFrameError("`import.source` with an options bag cannot be compiled.");
        }
        path.replaceWith(getHelper(this.file).buildFetchAsync(path.node.source, path));
      }
    }
  };
  function buildHelper(toCommonJS) {
    var _buildFetchAsync;
    let buildFetchAsync;
    let buildFetchSync;
    const p = ({
      web: w,
      node: n,
      webIMR: wI = webSupportsIMR,
      nodeIMR: nI = nodeSupportsIMR,
      toCJS: c = toCommonJS
    }) => +w + (+n << 1) + (+wI << 2) + (+nI << 3) + (+c << 4);
    const imr = s => template.expression.ast`
      import.meta.resolve(${s})
    `;
    const imrWithFallback = s => template.expression.ast`
      import.meta.resolve?.(${s}) ??
      new URL(${t.cloneNode(s)}, import.meta.url)
    `;
    switch (p({
      web: needsWebSupport,
      node: needsNodeSupport,
      webIMR: webSupportsIMR,
      nodeIMR: nodeSupportsIMR,
      toCJS: toCommonJS
    })) {
      case p({
        web: true,
        node: true
      }):
        buildFetchAsync = specifier => {
          const web = template.expression.ast`
            WebAssembly.compileStreaming(fetch(
              ${(webSupportsIMR ? imr : imrWithFallback)(t.cloneNode(specifier))}
            ))
          `;
          const node = nodeSupportsIMR ? template.expression.ast`
                import("fs")
                  .then(fs => fs.promises.readFile(new URL(${imr(specifier)})))
                  .then(WebAssembly.compile)
              ` : template.expression.ast`
                Promise.all([import("fs"), import("module")])
                  .then(([fs, module]) =>
                    fs.promises.readFile(
                      module.createRequire(import.meta.url)
                        .resolve(${specifier})
                    )
                  )
                  .then(WebAssembly.compile)
              `;
          return template.expression.ast`
            typeof process === "object" && process.versions?.node
              ? ${node}
              : ${web}
          `;
        };
        break;
      case p({
        web: true,
        node: true,
        webIMR: false,
        nodeIMR: true
      }):
        buildFetchAsync = specifier => template.expression.ast`
          typeof process === "object" && process.versions?.node
            ? import("fs").then(fs =>
                new WebAssembly.Module(fs.readFileSync(
                  new URL(${imr(specifier)})
                ))
              )
            : WebAssembly.compileStreaming(fetch(${imrWithFallback(specifier)}))
        `;
        break;
      case p({
        web: true,
        node: false,
        webIMR: true
      }):
        buildFetchAsync = specifier => template.expression.ast`
          WebAssembly.compileStreaming(fetch(${imr(specifier)}))
        `;
        break;
      case p({
        web: true,
        node: false,
        webIMR: false
      }):
        buildFetchAsync = specifier => template.expression.ast`
          WebAssembly.compileStreaming(fetch(${imrWithFallback(specifier)}))
        `;
        break;
      case p({
        web: false,
        node: true,
        toCJS: true
      }):
        buildFetchSync = specifier => template.expression.ast`
          new WebAssembly.Module(
            require("fs").readFileSync(
              require.resolve(${specifier})
            )
          )
        `;
        buildFetchAsync = specifier => template.expression.ast`
          require("fs").promises.readFile(require.resolve(${specifier}))
            .then(WebAssembly.compile)
        `;
        break;
      case p({
        web: false,
        node: true,
        toCJS: false,
        nodeIMR: true
      }):
        buildFetchSync = (specifier, path) => template.expression.ast`
          new WebAssembly.Module(
            ${imp(path, "readFileSync", "fs")}(
              new URL(${imr(specifier)})
            )
          )
        `;
        buildFetchAsync = (specifier, path) => template.expression.ast`
          ${imp(path, "promises", "fs")}
            .readFile(new URL(${imr(specifier)}))
            .then(WebAssembly.compile)
        `;
        break;
      case p({
        web: false,
        node: true,
        toCJS: false,
        nodeIMR: false
      }):
        buildFetchSync = (specifier, path) => template.expression.ast`
          new WebAssembly.Module(
            ${imp(path, "readFileSync", "fs")}(
              ${imp(path, "createRequire", "module")}(import.meta.url)
                .resolve(${specifier})
            )
          )
        `;
        buildFetchAsync = (specifier, path) => template.expression.ast`
          ${imp(path, "promises", "fs")}
            .readFile(
              ${imp(path, "createRequire", "module")}(import.meta.url)
                .resolve(${specifier})
            )
            .then(WebAssembly.compile)
        `;
        break;
      default:
        throw new Error("Internal Babel error: unreachable code.");
    }
    (_buildFetchAsync = buildFetchAsync) != null ? _buildFetchAsync : buildFetchAsync = buildFetchSync;
    const buildFetchAsyncWrapped = (expression, path) => {
      if (t.isStringLiteral(expression)) {
        return template.expression.ast`
          Promise.resolve().then(() => ${buildFetchAsync(expression, path)})
        `;
      } else {
        return template.expression.ast`
          Promise.resolve(\`\${${expression}}\`).then((s) => ${buildFetchAsync(t.identifier("s"), path)})
        `;
      }
    };
    return {
      buildFetch: buildFetchSync || buildFetchAsync,
      buildFetchAsync: buildFetchAsyncWrapped,
      needsAwait: !buildFetchSync
    };
  }
});

//# sourceMappingURL=index.js.map
