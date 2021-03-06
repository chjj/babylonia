"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  throw new Error(`
As of v7.0.0-beta.55, we've removed Babel's Stage presets.
Please consider reading our blog post on this decision at
https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets
for more details. TL;DR is that it's more beneficial in the
  long run to explicitly add which proposals to use.

For a more automatic migration, we have updated babel-upgrade,
https://github.com/babel/babel-upgrade to do this for you with
"npx babel-upgrade".

If you want the same configuration as before:

{
  "plugins": [
    // Stage 2
    ["babylonia/plugin-proposal-decorators", { "legacy": true }],
    "babylonia/plugin-proposal-function-sent",
    "babylonia/plugin-proposal-export-namespace-from",
    "babylonia/plugin-proposal-numeric-separator",
    "babylonia/plugin-proposal-throw-expressions",

    // Stage 3
    "babylonia/plugin-syntax-dynamic-import",
    "babylonia/plugin-syntax-import-meta",
    ["babylonia/plugin-proposal-class-properties", { "loose": false }],
    "babylonia/plugin-proposal-json-strings"
  ]
}

If you're using the same configuration across many separate projects,
keep in mind that you can also create your own custom presets with
whichever plugins and presets you're looking to use.

module.exports = function() {
  return {
    plugins: [
      require("babylonia/plugin-syntax-dynamic-import"),
      [require("babylonia/plugin-proposal-decorators"), { "legacy": true }],
      [require("babylonia/plugin-proposal-class-properties"), { "loose": false }],
    ],
    presets: [
      // ...
    ],
  };
};
`);
}