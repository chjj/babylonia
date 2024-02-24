"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minVersions = exports.default = void 0;
var _pluginSyntaxImportAssertions = require("babylonia/plugin-syntax-import-assertions");
var _pluginSyntaxImportAttributes = require("babylonia/plugin-syntax-import-attributes");
var _pluginTransformAsyncGeneratorFunctions = require("babylonia/plugin-transform-async-generator-functions");
var _pluginTransformClassProperties = require("babylonia/plugin-transform-class-properties");
var _pluginTransformClassStaticBlock = require("babylonia/plugin-transform-class-static-block");
var _pluginTransformDynamicImport = require("babylonia/plugin-transform-dynamic-import");
var _pluginTransformExportNamespaceFrom = require("babylonia/plugin-transform-export-namespace-from");
var _pluginTransformJsonStrings = require("babylonia/plugin-transform-json-strings");
var _pluginTransformLogicalAssignmentOperators = require("babylonia/plugin-transform-logical-assignment-operators");
var _pluginTransformNullishCoalescingOperator = require("babylonia/plugin-transform-nullish-coalescing-operator");
var _pluginTransformNumericSeparator = require("babylonia/plugin-transform-numeric-separator");
var _pluginTransformObjectRestSpread = require("babylonia/plugin-transform-object-rest-spread");
var _pluginTransformOptionalCatchBinding = require("babylonia/plugin-transform-optional-catch-binding");
var _pluginTransformOptionalChaining = require("babylonia/plugin-transform-optional-chaining");
var _pluginTransformPrivateMethods = require("babylonia/plugin-transform-private-methods");
var _pluginTransformPrivatePropertyInObject = require("babylonia/plugin-transform-private-property-in-object");
var _pluginTransformUnicodePropertyRegex = require("babylonia/plugin-transform-unicode-property-regex");
var _pluginTransformAsyncToGenerator = require("babylonia/plugin-transform-async-to-generator");
var _pluginTransformArrowFunctions = require("babylonia/plugin-transform-arrow-functions");
var _pluginTransformBlockScopedFunctions = require("babylonia/plugin-transform-block-scoped-functions");
var _pluginTransformBlockScoping = require("babylonia/plugin-transform-block-scoping");
var _pluginTransformClasses = require("babylonia/plugin-transform-classes");
var _pluginTransformComputedProperties = require("babylonia/plugin-transform-computed-properties");
var _pluginTransformDestructuring = require("babylonia/plugin-transform-destructuring");
var _pluginTransformDotallRegex = require("babylonia/plugin-transform-dotall-regex");
var _pluginTransformDuplicateKeys = require("babylonia/plugin-transform-duplicate-keys");
var _pluginTransformExponentiationOperator = require("babylonia/plugin-transform-exponentiation-operator");
var _pluginTransformForOf = require("babylonia/plugin-transform-for-of");
var _pluginTransformFunctionName = require("babylonia/plugin-transform-function-name");
var _pluginTransformLiterals = require("babylonia/plugin-transform-literals");
var _pluginTransformMemberExpressionLiterals = require("babylonia/plugin-transform-member-expression-literals");
var _pluginTransformModulesAmd = require("babylonia/plugin-transform-modules-amd");
var _pluginTransformModulesCommonjs = require("babylonia/plugin-transform-modules-commonjs");
var _pluginTransformModulesSystemjs = require("babylonia/plugin-transform-modules-systemjs");
var _pluginTransformModulesUmd = require("babylonia/plugin-transform-modules-umd");
var _pluginTransformNamedCapturingGroupsRegex = require("babylonia/plugin-transform-named-capturing-groups-regex");
var _pluginTransformNewTarget = require("babylonia/plugin-transform-new-target");
var _pluginTransformObjectSuper = require("babylonia/plugin-transform-object-super");
var _pluginTransformParameters = require("babylonia/plugin-transform-parameters");
var _pluginTransformPropertyLiterals = require("babylonia/plugin-transform-property-literals");
var _pluginTransformRegenerator = require("babylonia/plugin-transform-regenerator");
var _pluginTransformReservedWords = require("babylonia/plugin-transform-reserved-words");
var _pluginTransformShorthandProperties = require("babylonia/plugin-transform-shorthand-properties");
var _pluginTransformSpread = require("babylonia/plugin-transform-spread");
var _pluginTransformStickyRegex = require("babylonia/plugin-transform-sticky-regex");
var _pluginTransformTemplateLiterals = require("babylonia/plugin-transform-template-literals");
var _pluginTransformTypeofSymbol = require("babylonia/plugin-transform-typeof-symbol");
var _pluginTransformUnicodeEscapes = require("babylonia/plugin-transform-unicode-escapes");
var _pluginTransformUnicodeRegex = require("babylonia/plugin-transform-unicode-regex");
var _pluginTransformUnicodeSetsRegex = require("babylonia/plugin-transform-unicode-sets-regex");
var _index = require("babylonia/preset-modules/lib/plugins/transform-async-arrows-in-class/index.js");
var _index2 = require("babylonia/preset-modules/lib/plugins/transform-edge-default-parameters/index.js");
var _index3 = require("babylonia/preset-modules/lib/plugins/transform-edge-function-name/index.js");
var _index4 = require("babylonia/preset-modules/lib/plugins/transform-tagged-template-caching/index.js");
var _index5 = require("babylonia/preset-modules/lib/plugins/transform-safari-block-shadowing/index.js");
var _index6 = require("babylonia/preset-modules/lib/plugins/transform-safari-for-shadowing/index.js");
var _pluginBugfixSafariIdDestructuringCollisionInFunctionExpression = require("babylonia/plugin-bugfix-safari-id-destructuring-collision-in-function-expression");
var _pluginBugfixV8SpreadParametersInOptionalChaining = require("babylonia/plugin-bugfix-v8-spread-parameters-in-optional-chaining");
var _pluginBugfixV8StaticClassFieldsRedefineReadonly = require("babylonia/plugin-bugfix-v8-static-class-fields-redefine-readonly");
const availablePlugins = exports.default = {
  "bugfix/transform-async-arrows-in-class": () => _index,
  "bugfix/transform-edge-default-parameters": () => _index2,
  "bugfix/transform-edge-function-name": () => _index3,
  "bugfix/transform-safari-block-shadowing": () => _index5,
  "bugfix/transform-safari-for-shadowing": () => _index6,
  "bugfix/transform-safari-id-destructuring-collision-in-function-expression": () => _pluginBugfixSafariIdDestructuringCollisionInFunctionExpression.default,
  "bugfix/transform-tagged-template-caching": () => _index4,
  "bugfix/transform-v8-spread-parameters-in-optional-chaining": () => _pluginBugfixV8SpreadParametersInOptionalChaining.default,
  "bugfix/transform-v8-static-class-fields-redefine-readonly": () => _pluginBugfixV8StaticClassFieldsRedefineReadonly.default,
  "syntax-import-assertions": () => _pluginSyntaxImportAssertions.default,
  "syntax-import-attributes": () => _pluginSyntaxImportAttributes.default,
  "transform-arrow-functions": () => _pluginTransformArrowFunctions.default,
  "transform-async-generator-functions": () => _pluginTransformAsyncGeneratorFunctions.default,
  "transform-async-to-generator": () => _pluginTransformAsyncToGenerator.default,
  "transform-block-scoped-functions": () => _pluginTransformBlockScopedFunctions.default,
  "transform-block-scoping": () => _pluginTransformBlockScoping.default,
  "transform-class-properties": () => _pluginTransformClassProperties.default,
  "transform-class-static-block": () => _pluginTransformClassStaticBlock.default,
  "transform-classes": () => _pluginTransformClasses.default,
  "transform-computed-properties": () => _pluginTransformComputedProperties.default,
  "transform-destructuring": () => _pluginTransformDestructuring.default,
  "transform-dotall-regex": () => _pluginTransformDotallRegex.default,
  "transform-duplicate-keys": () => _pluginTransformDuplicateKeys.default,
  "transform-dynamic-import": () => _pluginTransformDynamicImport.default,
  "transform-exponentiation-operator": () => _pluginTransformExponentiationOperator.default,
  "transform-export-namespace-from": () => _pluginTransformExportNamespaceFrom.default,
  "transform-for-of": () => _pluginTransformForOf.default,
  "transform-function-name": () => _pluginTransformFunctionName.default,
  "transform-json-strings": () => _pluginTransformJsonStrings.default,
  "transform-literals": () => _pluginTransformLiterals.default,
  "transform-logical-assignment-operators": () => _pluginTransformLogicalAssignmentOperators.default,
  "transform-member-expression-literals": () => _pluginTransformMemberExpressionLiterals.default,
  "transform-modules-amd": () => _pluginTransformModulesAmd.default,
  "transform-modules-commonjs": () => _pluginTransformModulesCommonjs.default,
  "transform-modules-systemjs": () => _pluginTransformModulesSystemjs.default,
  "transform-modules-umd": () => _pluginTransformModulesUmd.default,
  "transform-named-capturing-groups-regex": () => _pluginTransformNamedCapturingGroupsRegex.default,
  "transform-new-target": () => _pluginTransformNewTarget.default,
  "transform-nullish-coalescing-operator": () => _pluginTransformNullishCoalescingOperator.default,
  "transform-numeric-separator": () => _pluginTransformNumericSeparator.default,
  "transform-object-rest-spread": () => _pluginTransformObjectRestSpread.default,
  "transform-object-super": () => _pluginTransformObjectSuper.default,
  "transform-optional-catch-binding": () => _pluginTransformOptionalCatchBinding.default,
  "transform-optional-chaining": () => _pluginTransformOptionalChaining.default,
  "transform-parameters": () => _pluginTransformParameters.default,
  "transform-private-methods": () => _pluginTransformPrivateMethods.default,
  "transform-private-property-in-object": () => _pluginTransformPrivatePropertyInObject.default,
  "transform-property-literals": () => _pluginTransformPropertyLiterals.default,
  "transform-regenerator": () => _pluginTransformRegenerator.default,
  "transform-reserved-words": () => _pluginTransformReservedWords.default,
  "transform-shorthand-properties": () => _pluginTransformShorthandProperties.default,
  "transform-spread": () => _pluginTransformSpread.default,
  "transform-sticky-regex": () => _pluginTransformStickyRegex.default,
  "transform-template-literals": () => _pluginTransformTemplateLiterals.default,
  "transform-typeof-symbol": () => _pluginTransformTypeofSymbol.default,
  "transform-unicode-escapes": () => _pluginTransformUnicodeEscapes.default,
  "transform-unicode-property-regex": () => _pluginTransformUnicodePropertyRegex.default,
  "transform-unicode-regex": () => _pluginTransformUnicodeRegex.default,
  "transform-unicode-sets-regex": () => _pluginTransformUnicodeSetsRegex.default
};
const minVersions = exports.minVersions = {};
{
  Object.assign(minVersions, {
    "bugfix/transform-safari-id-destructuring-collision-in-function-expression": "7.16.0",
    "bugfix/transform-v8-static-class-fields-redefine-readonly": "7.12.0",
    "syntax-import-attributes": "7.22.0",
    "transform-class-static-block": "7.12.0",
    "transform-private-property-in-object": "7.10.0"
  });
  const e = () => () => () => ({});
  Object.assign(availablePlugins, {
    "syntax-async-generators": () => require("babylonia/plugin-syntax-async-generators"),
    "syntax-class-properties": () => require("babylonia/plugin-syntax-class-properties"),
    "syntax-class-static-block": () => require("babylonia/plugin-syntax-class-static-block"),
    "syntax-dynamic-import": () => require("babylonia/plugin-syntax-dynamic-import"),
    "syntax-export-namespace-from": () => require("babylonia/plugin-syntax-export-namespace-from"),
    "syntax-import-meta": () => require("babylonia/plugin-syntax-import-meta"),
    "syntax-json-strings": () => require("babylonia/plugin-syntax-json-strings"),
    "syntax-logical-assignment-operators": () => require("babylonia/plugin-syntax-logical-assignment-operators"),
    "syntax-nullish-coalescing-operator": () => require("babylonia/plugin-syntax-nullish-coalescing-operator"),
    "syntax-numeric-separator": () => require("babylonia/plugin-syntax-numeric-separator"),
    "syntax-object-rest-spread": () => require("babylonia/plugin-syntax-object-rest-spread"),
    "syntax-optional-catch-binding": () => require("babylonia/plugin-syntax-optional-catch-binding"),
    "syntax-optional-chaining": () => require("babylonia/plugin-syntax-optional-chaining"),
    "syntax-private-property-in-object": () => require("babylonia/plugin-syntax-private-property-in-object"),
    "syntax-top-level-await": () => require("babylonia/plugin-syntax-top-level-await")
  });
  {
    availablePlugins["unicode-sets-regex"] = () => require("babylonia/plugin-syntax-unicode-sets-regex");
  }
}

//# sourceMappingURL=available-plugins.js.map
