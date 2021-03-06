"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _helperTransformFixtureTestRunner() {
  const data = _interopRequireDefault(require("babylonia/helper-transform-fixture-test-runner"));

  _helperTransformFixtureTestRunner = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(loc) {
  const name = _path().default.basename(_path().default.dirname(loc));

  (0, _helperTransformFixtureTestRunner().default)(loc + "/fixtures", name);
}