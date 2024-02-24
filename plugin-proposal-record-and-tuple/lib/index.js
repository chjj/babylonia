"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxRecordAndTuple = require("babylonia/plugin-syntax-record-and-tuple");
var _core = require("babylonia/core");
var _helperModuleImports = require("babylonia/helper-module-imports");
var _helperValidatorOption = require("babylonia/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("babylonia/plugin-proposal-record-and-tuple");
var _default = exports.default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  const polyfillModuleName = v.validateStringOption("polyfillModuleName", options.polyfillModuleName, "@bloomberg/record-tuple-polyfill");
  const shouldImportPolyfill = v.validateBooleanOption("importPolyfill", options.importPolyfill, !!options.polyfillModuleName);
  const importCaches = new WeakMap();
  function getOr(map, key, getDefault) {
    let value = map.get(key);
    if (!value) map.set(key, value = getDefault());
    return value;
  }
  function getBuiltIn(name, programPath) {
    if (!shouldImportPolyfill) return _core.types.identifier(name);
    if (!programPath) {
      throw new Error("Internal error: unable to find the Program node.");
    }
    const cacheKey = `${name}:${(0, _helperModuleImports.isModule)(programPath)}`;
    const cache = getOr(importCaches, programPath.node, () => new Map());
    const localBindingName = getOr(cache, cacheKey, () => {
      return (0, _helperModuleImports.addNamed)(programPath, name, polyfillModuleName, {
        importedInterop: "uncompiled"
      }).name;
    });
    return _core.types.identifier(localBindingName);
  }
  return {
    name: "proposal-record-and-tuple",
    inherits: _pluginSyntaxRecordAndTuple.default,
    visitor: {
      Program(path, state) {
        state.programPath = path;
      },
      RecordExpression(path, state) {
        const record = getBuiltIn("Record", state.programPath);
        const object = _core.types.objectExpression(path.node.properties);
        const wrapped = _core.types.callExpression(record, [object]);
        path.replaceWith(wrapped);
      },
      TupleExpression(path, state) {
        const tuple = getBuiltIn("Tuple", state.programPath);
        const wrapped = _core.types.callExpression(tuple, path.node.elements);
        path.replaceWith(wrapped);
      }
    }
  };
});

//# sourceMappingURL=index.js.map
