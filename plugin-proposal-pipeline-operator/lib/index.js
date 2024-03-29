"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("babylonia/helper-plugin-utils");
var _pluginSyntaxPipelineOperator = require("babylonia/plugin-syntax-pipeline-operator");
var _minimalVisitor = require("./minimalVisitor.js");
var _hackVisitor = require("./hackVisitor.js");
var _fsharpVisitor = require("./fsharpVisitor.js");
var _smartVisitor = require("./smartVisitor.js");
const visitorsPerProposal = {
  minimal: _minimalVisitor.default,
  hack: _hackVisitor.default,
  fsharp: _fsharpVisitor.default,
  smart: _smartVisitor.default
};
var _default = exports.default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  const {
    proposal
  } = options;
  if (proposal === "smart") {
    console.warn(`The smart-mix pipe operator is deprecated. Use "proposal": "hack" instead.`);
  }
  return {
    name: "proposal-pipeline-operator",
    inherits: _pluginSyntaxPipelineOperator.default,
    visitor: visitorsPerProposal[options.proposal]
  };
});

//# sourceMappingURL=index.js.map
