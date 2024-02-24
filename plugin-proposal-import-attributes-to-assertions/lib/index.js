"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxImportAttributes = require("babylonia/plugin-syntax-import-attributes");
var _default = exports.default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "proposal-import-attributes-to-assertions",
    inherits: _pluginSyntaxImportAttributes.default,
    manipulateOptions({
      generatorOpts
    }) {
      generatorOpts.importAttributesKeyword = "assert";
    },
    visitor: {
      "ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration"(path) {
        const {
          node
        } = path;
        if (!node.attributes) return;
        node.assertions = node.attributes;
        node.attributes = null;
      }
    }
  };
});

//# sourceMappingURL=index.js.map
