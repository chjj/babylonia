"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _helperTransformFixtureTestRunner = require("@babel/helper-transform-fixture-test-runner");
var _path = require("path");
var _url = require("url");
function _default(loc) {
  {
    if (!loc.startsWith("file://")) {
      const name = _path.basename(_path.dirname(loc));
      (0, _helperTransformFixtureTestRunner.default)(loc + "/fixtures", name);
      return;
    }
  }
  let fixtures = new _url.URL("./fixtures", loc).pathname;
  if (process.platform === "win32") {
    fixtures = fixtures.slice(1);
  }
  const name = _path.basename(new _url.URL("..", loc).pathname);
  (0, _helperTransformFixtureTestRunner.default)(fixtures, name);
}

//# sourceMappingURL=index.js.map
