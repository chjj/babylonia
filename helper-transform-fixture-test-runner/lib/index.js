"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildParallelProcessTests = buildParallelProcessTests;
exports.buildProcessTests = buildProcessTests;
exports.createTestContext = createTestContext;
exports.default = _default;
exports.runCodeInTestContext = runCodeInTestContext;
var _core = require("babylonia/core");
var babel = _core;
var _helperFixtures = require("babylonia/helper-fixtures");
var _codeFrame = require("babylonia/code-frame");
var helpers = require("./helpers.js");
var _sourceMapVisualizer = require("./source-map-visualizer.js");
var _assert = require("assert");
var _fs = _interopRequireWildcard(require("fs"), true);
var _path = require("path");
var _vm = require("vm");
var _lruCache = require("lru-cache");
var _url = require("url");
var _jestDiff = require("jest-diff");
var _child_process = require("child_process");
var _os = require("os");
var _makeDir = require("make-dir");
var _fsReaddirRecursive = require("fs-readdir-recursive");
var _module = require("module");
var _helperCheckDuplicateNodes = require("babylonia/helper-check-duplicate-nodes");
var _crypto = require("crypto");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const dirname = _path.dirname(__filename);
{
  if (!_assert.rejects) {
    _assert.rejects = _asyncToGenerator(function* (block, validateError) {
      try {
        yield typeof block === "function" ? block() : block;
        return Promise.reject(new Error("Promise not rejected"));
      } catch (error) {
        if (typeof validateError === "function" && !validateError(error)) {
          return Promise.reject(new Error("Promise rejected with invalid error"));
        }
      }
    });
  }
}
const EXTERNAL_HELPERS_VERSION = "7.100.0";
const cachedScripts = new _lruCache({
  max: 10
});
const contextModuleCache = new WeakMap();
const sharedTestContext = createTestContext();
function transformWithoutConfigFile(code, opts) {
  return babel.transformSync(code, Object.assign({
    configFile: false,
    babelrc: false
  }, opts));
}
function transformAsyncWithoutConfigFile(code, opts) {
  return babel.transformAsync(code, Object.assign({
    configFile: false,
    babelrc: false
  }, opts));
}
function createTestContext() {
  const context = _vm.createContext(Object.assign({}, helpers, {
    process: process,
    transform: transformWithoutConfigFile,
    transformAsync: transformAsyncWithoutConfigFile,
    setTimeout: setTimeout,
    setImmediate: setImmediate,
    expect
  }));
  context.global = context;
  const moduleCache = Object.create(null);
  contextModuleCache.set(context, moduleCache);
  runCacheableScriptInTestContext(_path.join(_path.dirname(__filename), "babel-helpers-in-memory.js"), _core.buildExternalHelpers, context, moduleCache);
  return context;
}
function runCacheableScriptInTestContext(filename, srcFn, context, moduleCache) {
  let cached = cachedScripts.get(filename);
  if (!cached) {
    const code = `(function (exports, require, module, __filename, __dirname) {\n${srcFn()}\n});`;
    cached = {
      code,
      cachedData: undefined
    };
    cachedScripts.set(filename, cached);
  }
  let script;
  {
    script = new _vm.Script(cached.code, {
      filename,
      lineOffset: -1,
      cachedData: cached.cachedData,
      produceCachedData: true
    });
    if (script.cachedDataProduced) {
      cached.cachedData = script.cachedData;
    }
  }
  const module = {
    id: filename,
    exports: {}
  };
  moduleCache[filename] = module;
  const req = id => runModuleInTestContext(id, filename, context, moduleCache);
  const dirname = _path.dirname(filename);
  script.runInContext(context).call(module.exports, module.exports, req, module, filename, dirname);
  return module;
}
function runModuleInTestContext(id, relativeFilename, context, moduleCache) {
  const filename = (((v, w) => (v = v.split("."), w = w.split("."), +v[0] > +w[0] || v[0] == w[0] && +v[1] >= +w[1]))(process.versions.node, "8.9") ? require.resolve : (r, {
    paths: [b]
  }, M = require("module")) => {
    let f = M._findPath(r, M._nodeModulePaths(b).concat(b));
    if (f) return f;
    f = new Error(`Cannot resolve module '${r}'`);
    f.code = "MODULE_NOT_FOUND";
    throw f;
  })(id, {
    paths: [_path.dirname(relativeFilename)]
  });
  if (filename === id) return require(id);
  if (moduleCache[filename]) return moduleCache[filename].exports;
  return runCacheableScriptInTestContext(filename, () => _fs.default.readFileSync(filename, "utf8"), context, moduleCache).exports;
}
function runCodeInTestContext(code, opts, context = sharedTestContext) {
  const filename = opts.filename;
  const dirname = _path.dirname(filename);
  const moduleCache = contextModuleCache.get(context);
  const req = id => runModuleInTestContext(id, filename, context, moduleCache);
  const module = {
    id: filename,
    exports: {}
  };
  const oldCwd = process.cwd();
  try {
    if (opts.filename) process.chdir(_path.dirname(opts.filename));
    const src = `(function(exports, require, module, __filename, __dirname, opts) {\n${code}\n});`;
    return _vm.runInContext(src, context, {
      filename,
      displayErrors: true,
      lineOffset: -1
    })(module.exports, req, module, filename, dirname, opts);
  } finally {
    process.chdir(oldCwd);
  }
}
function maybeMockConsole(_x3, _x4) {
  return _maybeMockConsole.apply(this, arguments);
}
function _maybeMockConsole() {
  _maybeMockConsole = _asyncToGenerator(function* (validateLogs, run) {
    const actualLogs = {
      stdout: "",
      stderr: ""
    };
    if (!validateLogs) return {
      result: yield run(),
      actualLogs
    };
    const spy1 = jest.spyOn(console, "log").mockImplementation(msg => {
      actualLogs.stdout += `${msg}\n`;
    });
    const spy2 = jest.spyOn(console, "warn").mockImplementation(msg => {
      actualLogs.stderr += `${msg}\n`;
    });
    try {
      return {
        result: yield run(),
        actualLogs
      };
    } finally {
      spy1.mockRestore();
      spy2.mockRestore();
    }
  });
  return _maybeMockConsole.apply(this, arguments);
}
function run(_x5) {
  return _run.apply(this, arguments);
}
function _run() {
  _run = _asyncToGenerator(function* (task) {
    const {
      actual,
      expect: expected,
      exec,
      options: opts,
      doNotSetSourceType,
      optionsDir,
      validateLogs,
      ignoreOutput,
      stdout,
      stderr
    } = task;
    function getOpts(self) {
      const newOpts = Object.assign({
        ast: true,
        cwd: _path.dirname(self.loc),
        filename: self.loc,
        filenameRelative: self.filename,
        sourceFileName: self.filename
      }, doNotSetSourceType ? {} : {
        sourceType: "script"
      }, {
        babelrc: false,
        configFile: false,
        inputSourceMap: task.inputSourceMap || undefined
      }, opts);
      return (0, _helperFixtures.resolveOptionPluginOrPreset)(newOpts, optionsDir);
    }
    let execCode = exec.code;
    let result;
    let resultExec;
    if (execCode) {
      const context = createTestContext();
      const execOpts = getOpts(exec);
      ({
        result
      } = yield maybeMockConsole(validateLogs, () => babel.transformAsync(execCode, execOpts)));
      (0, _helperCheckDuplicateNodes.default)(result.ast);
      execCode = result.code;
      try {
        resultExec = runCodeInTestContext(execCode, execOpts, context);
      } catch (err) {
        err.message = `${exec.loc}: ${err.message}\n` + (0, _codeFrame.codeFrameColumns)(execCode, {});
        throw err;
      }
    }
    const inputCode = actual.code;
    const expectedCode = expected.code;
    if (!execCode || inputCode) {
      let actualLogs;
      ({
        result,
        actualLogs
      } = yield maybeMockConsole(validateLogs, () => babel.transformAsync(inputCode, getOpts(actual))));
      const outputCode = normalizeOutput(result.code);
      (0, _helperCheckDuplicateNodes.default)(result.ast);
      if (!ignoreOutput) {
        if (!expected.code && outputCode && !opts.throws && _fs.default.statSync(_path.dirname(expected.loc)).isDirectory() && !process.env.CI) {
          const expectedFile = expected.loc.replace(/\.m?js$/, result.sourceType === "module" ? ".mjs" : ".js");
          console.log(`New test file created: ${expectedFile}`);
          _fs.default.writeFileSync(expectedFile, `${outputCode}\n`);
          if (expected.loc !== expectedFile) {
            try {
              _fs.default.unlinkSync(expected.loc);
            } catch (e) {}
          }
        } else {
          validateFile(outputCode, expected.loc, expectedCode);
          if (inputCode) {
            expect(expected.loc).toMatch(result.sourceType === "module" ? /\.mjs$/ : /\.js$/);
          }
        }
      }
      if (validateLogs) {
        const normalizationOpts = {
          normalizePathSeparator: true,
          normalizePresetEnvDebug: task.taskDir.includes("babel-preset-env")
        };
        validateFile(normalizeOutput(actualLogs.stdout, normalizationOpts), stdout.loc, stdout.code);
        validateFile(normalizeOutput(actualLogs.stderr, normalizationOpts), stderr.loc, stderr.code);
      }
    }
    if (task.validateSourceMapVisual === true) {
      const visual = (0, _sourceMapVisualizer.default)(result.code, result.map);
      try {
        expect(visual).toEqual(task.sourceMapVisual.code);
      } catch (e) {
        var _task$sourceMapVisual;
        if (!process.env.OVERWRITE && task.sourceMapVisual.code) throw e;
        console.log(`Updated test file: ${task.sourceMapVisual.loc}`);
        _fs.default.writeFileSync((_task$sourceMapVisual = task.sourceMapVisual.loc) != null ? _task$sourceMapVisual : task.taskDir + "/source-map-visual.txt", visual + "\n");
      }
    }
    if (opts.sourceMaps === true) {
      try {
        expect(result.map).toEqual(task.sourceMap);
      } catch (e) {
        if (!process.env.OVERWRITE && task.sourceMap) throw e;
        console.log(`Updated test file: ${task.sourceMapFile.loc}`);
        _fs.default.writeFileSync(task.sourceMapFile.loc, JSON.stringify(result.map, null, 2));
      }
    }
    if (execCode && resultExec) {
      return resultExec;
    }
  });
  return _run.apply(this, arguments);
}
function validateFile(actualCode, expectedLoc, expectedCode) {
  if (actualCode !== expectedCode) {
    if (process.env.OVERWRITE) {
      console.log(`Updated test file: ${expectedLoc}`);
      _fs.default.writeFileSync(expectedLoc, `${actualCode}\n`);
      return;
    }
    throw new Error(`Expected ${expectedLoc} to match transform output.\n` + `To autogenerate a passing version of this file, delete ` + ` the file and re-run the tests.\n\n` + `Diff:\n\n${(0, _jestDiff.diff)(expectedCode, actualCode, {
      expand: false
    })}`);
  }
}
function escapeRegExp(string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
function normalizeOutput(code, {
  normalizePathSeparator = false,
  normalizePresetEnvDebug = false
} = {}) {
  const projectRoot = _path.resolve(_path.dirname(__filename), "../../../");
  const cwdSymbol = "<CWD>";
  let result = code.trim().replace(new RegExp(escapeRegExp(projectRoot), "g"), cwdSymbol);
  if (process.platform === "win32") {
    result = result.replace(new RegExp(escapeRegExp(projectRoot.replace(/\\/g, "/")), "g"), cwdSymbol).replace(new RegExp(escapeRegExp(projectRoot.replace(/\\/g, "\\\\")), "g"), cwdSymbol);
    if (normalizePathSeparator) {
      result = result.replace(/<CWD>[\w\\/.-]+/g, path => path.replace(/\\\\?/g, "/"));
    }
  }
  {
    if (normalizePresetEnvDebug) {
      result = result.replace(/(\s+)proposal-/gm, "$1transform-");
    }
    if (parseInt(process.versions.node, 10) <= 8) {
      result = result.replace(/<CWD>\/node_modules\/babylonia\/runtime-corejs3/g, "<CWD>/packages/babel-runtime-corejs3");
    }
  }
  return result;
}
function _default(fixturesLoc, name, suiteOpts = {}, taskOpts = {}, dynamicOpts) {
  const suites = (0, _helperFixtures.default)(fixturesLoc);
  for (const testSuite of suites) {
    var _suiteOpts$ignoreSuit;
    if ((_suiteOpts$ignoreSuit = suiteOpts.ignoreSuites) != null && _suiteOpts$ignoreSuit.includes(testSuite.title)) continue;
    describe(name + "/" + testSuite.title, function () {
      for (const task of testSuite.tests) {
        var _suiteOpts$ignoreTask, _suiteOpts$ignoreTask2;
        if ((_suiteOpts$ignoreTask = suiteOpts.ignoreTasks) != null && _suiteOpts$ignoreTask.includes(task.title) || (_suiteOpts$ignoreTask2 = suiteOpts.ignoreTasks) != null && _suiteOpts$ignoreTask2.includes(testSuite.title + "/" + task.title)) {
          continue;
        }
        const testFn = task.disabled ? it.skip : it;
        testFn(task.title, _asyncToGenerator(function* () {
          const runTask = () => run(task);
          if ("sourceMap" in task.options) {
            throw new Error("`sourceMap` option is deprecated. Use `sourceMaps` instead.");
          }
          if ("sourceMaps" in task.options === false) {
            task.options.sourceMaps = !!task.sourceMap;
          }
          Object.assign(task.options, taskOpts);
          if (dynamicOpts) dynamicOpts(task.options, task);
          if (task.externalHelpers) {
            var _task$options, _task$options$plugins;
            ((_task$options$plugins = (_task$options = task.options).plugins) != null ? _task$options$plugins : _task$options.plugins = []).push(["external-helpers", {
              helperVersion: EXTERNAL_HELPERS_VERSION
            }]);
          }
          const throwMsg = task.options.throws;
          if (throwMsg) {
            delete task.options.throws;
            yield _assert.rejects(runTask, function (err) {
              _assert.ok(throwMsg === true || err.message.includes(throwMsg), `
Expected Error: ${throwMsg}
Actual Error: ${err.message}`);
              return true;
            });
          } else {
            return runTask();
          }
        }));
      }
    });
  }
}
const nodeGte8 = parseInt(process.versions.node, 10) >= 8;
const tmpDir = (0, _fs.realpathSync)(_os.tmpdir());
const readDir = function (loc, filter) {
  const files = {};
  if (_fs.default.existsSync(loc)) {
    _fsReaddirRecursive(loc, filter).forEach(function (filename) {
      files[filename] = (0, _helperFixtures.readFile)(_path.join(loc, filename));
    });
  }
  return files;
};
const outputFileSync = function (filePath, data) {
  (0, _makeDir.sync)(_path.dirname(filePath));
  _fs.default.writeFileSync(filePath, data);
};
function deleteDir(path) {
  if (_fs.default.existsSync(path)) {
    _fs.default.readdirSync(path).forEach(function (file) {
      const curPath = path + "/" + file;
      if (_fs.default.lstatSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        _fs.default.unlinkSync(curPath);
      }
    });
    _fs.default.rmdirSync(path);
  }
}
const fileFilter = function (x) {
  return x !== ".DS_Store";
};
const assertTest = function (stdout, stderr, ipcMessage, opts, tmpDir) {
  const expectStderr = opts.stderr.trim();
  stderr = stderr.trim();
  try {
    if (opts.stderr) {
      if (opts.stderrContains) {
        expect(stderr).toContain(expectStderr);
      } else {
        expect(stderr).toBe(expectStderr);
      }
    } else if (stderr) {
      throw new Error("stderr:\n" + stderr);
    }
  } catch (e) {
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stderrPath}`);
    outputFileSync(opts.stderrPath, stderr + "\n");
  }
  const expectStdout = opts.stdout.trim();
  stdout = stdout.trim();
  stdout = stdout.replace(/\\/g, "/");
  try {
    if (opts.stdout) {
      if (opts.stdoutContains) {
        expect(stdout).toContain(expectStdout);
      } else {
        expect(stdout).toBe(expectStdout);
      }
    } else if (stdout) {
      throw new Error("stdout:\n" + stdout);
    }
  } catch (e) {
    console.log(JSON.stringify(opts.stdout), JSON.stringify(stdout));
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stdoutPath}`);
    outputFileSync(opts.stdoutPath, stdout + "\n");
  }
  if (opts.ipc) {
    expect(ipcMessage).toEqual(opts.ipcMessage);
  }
  if (opts.outFiles) {
    const actualFiles = readDir(tmpDir, fileFilter);
    Object.keys(actualFiles).forEach(function (filename) {
      try {
        if (filename !== ".babelrc" && filename !== ".babelignore" && !Object.prototype.hasOwnProperty.call(opts.inFiles, filename)) {
          const expected = opts.outFiles[filename];
          const actual = actualFiles[filename];
          expect(actual).toBe(expected || "");
        }
      } catch (e) {
        if (!process.env.OVERWRITE) {
          e.message += "\n at " + filename;
          throw e;
        }
        const expectedLoc = _path.join(opts.testLoc, "out-files", filename);
        console.log(`Updated test file: ${expectedLoc}`);
        outputFileSync(expectedLoc, actualFiles[filename]);
      }
    });
    Object.keys(opts.outFiles).forEach(function (filename) {
      expect(actualFiles).toHaveProperty([filename]);
    });
  }
};
function buildParallelProcessTests(name, tests) {
  return function (curr, total) {
    const sliceLength = Math.ceil(tests.length / total);
    const sliceStart = curr * sliceLength;
    const sliceEnd = sliceStart + sliceLength;
    const testsSlice = tests.slice(sliceStart, sliceEnd);
    describe(`${name} [${curr}/${total}]`, function () {
      it("dummy", () => {});
      for (const test of testsSlice) {
        (test.skip ? it.skip : it)(test.suiteName + " " + test.testName, test.fn);
      }
    });
  };
}
function buildProcessTests(dir, beforeHook, afterHook) {
  const tests = [];
  _fs.default.readdirSync(dir).forEach(function (suiteName) {
    if (suiteName.startsWith(".") || suiteName === "package.json") return;
    const suiteLoc = _path.join(dir, suiteName);
    _fs.default.readdirSync(suiteLoc).forEach(function (testName) {
      if (testName.startsWith(".")) return;
      const testLoc = _path.join(suiteLoc, testName);
      let opts = {
        args: []
      };
      const optionsLoc = _path.join(testLoc, "options.json");
      if (_fs.default.existsSync(optionsLoc)) {
        const taskOpts = JSON.parse((0, _fs.readFileSync)(optionsLoc, "utf8"));
        if (taskOpts.os) {
          let os = taskOpts.os;
          if (!Array.isArray(os) && typeof os !== "string") {
            throw new Error(`'os' should be either string or string array: ${taskOpts.os}`);
          }
          if (typeof os === "string") {
            os = [os];
          }
          if (!os.includes(process.platform)) {
            return;
          }
          delete taskOpts.os;
        }
        opts = Object.assign({
          args: []
        }, taskOpts);
      }
      const executorLoc = _path.join(testLoc, "executor.js");
      if (_fs.default.existsSync(executorLoc)) {
        opts.executor = executorLoc;
      }
      opts.stderrPath = _path.join(testLoc, "stderr.txt");
      opts.stdoutPath = _path.join(testLoc, "stdout.txt");
      for (const key of ["stdout", "stdin", "stderr"]) {
        const loc = _path.join(testLoc, key + ".txt");
        if (_fs.default.existsSync(loc)) {
          opts[key] = (0, _helperFixtures.readFile)(loc);
        } else {
          opts[key] = opts[key] || "";
        }
      }
      opts.testLoc = testLoc;
      opts.outFiles = readDir(_path.join(testLoc, "out-files"), fileFilter);
      opts.inFiles = readDir(_path.join(testLoc, "in-files"), fileFilter);
      const babelrcLoc = _path.join(testLoc, ".babelrc");
      const babelIgnoreLoc = _path.join(testLoc, ".babelignore");
      if (_fs.default.existsSync(babelrcLoc)) {
        opts.inFiles[".babelrc"] = (0, _helperFixtures.readFile)(babelrcLoc);
      } else if (!opts.noBabelrc) {
        opts.inFiles[".babelrc"] = "{}";
      }
      if (_fs.default.existsSync(babelIgnoreLoc)) {
        opts.inFiles[".babelignore"] = (0, _helperFixtures.readFile)(babelIgnoreLoc);
      }
      const skip = opts.minNodeVersion && parseInt(process.versions.node, 10) < opts.minNodeVersion || opts.flaky && !process.env.BABEL_CLI_FLAKY_TESTS || opts.BABEL_8_BREAKING === false;
      if (opts.flaky) {
        testName += " (flaky)";
      }
      const test = {
        suiteName,
        testName,
        skip,
        opts,
        fn: function (callback) {
          const tmpLoc = _path.join(tmpDir, "babel-process-test", (0, _crypto.createHash)("sha1").update(testLoc).digest("hex"));
          deleteDir(tmpLoc);
          (0, _makeDir.sync)(tmpLoc);
          const {
            inFiles
          } = opts;
          for (const filename of Object.keys(inFiles)) {
            outputFileSync(_path.join(tmpLoc, filename), inFiles[filename]);
          }
          try {
            beforeHook(test, tmpLoc);
            if (test.binLoc === undefined) {
              throw new Error("test.binLoc is undefined");
            }
            let args = opts.executor && nodeGte8 ? ["--require", _path.join(dirname, "./exit-loader.cjs"), test.binLoc] : [test.binLoc];
            args = args.concat(opts.args);
            const env = Object.assign({}, process.env, {
              FORCE_COLOR: "false"
            }, opts.env);
            const child = (0, _child_process.spawn)(process.execPath, args, {
              env,
              cwd: tmpLoc,
              stdio: opts.executor && nodeGte8 || opts.ipc ? ["pipe", "pipe", "pipe", "ipc"] : "pipe"
            });
            let stderr = "";
            let stdout = "";
            let ipcMessage;
            child.on("close", function () {
              let err;
              try {
                const result = afterHook ? afterHook(test, tmpLoc, stdout, stderr) : {
                  stdout,
                  stderr
                };
                assertTest(result.stdout, result.stderr, ipcMessage, opts, tmpLoc);
              } catch (e) {
                err = e;
              } finally {
                try {
                  deleteDir(tmpLoc);
                } catch (error) {
                  console.error(error);
                }
              }
              if (err) {
                err.message = args.map(arg => `"${arg}"`).join(" ") + ": " + err.message;
              }
              callback(err);
            });
            if (opts.ipc) {
              child.on("message", function (message) {
                ipcMessage = message;
              });
            }
            if (opts.stdin) {
              child.stdin.write(opts.stdin);
              child.stdin.end();
            }
            const captureOutput = proc => {
              proc.stderr.on("data", function (chunk) {
                stderr += chunk;
              });
              proc.stdout.on("data", function (chunk) {
                stdout += chunk;
              });
            };
            if (opts.executor) {
              const executor = (0, _child_process.spawn)(process.execPath, [opts.executor], {
                cwd: tmpLoc
              });
              child.stdout.pipe(executor.stdin);
              child.stderr.pipe(executor.stdin);
              executor.on("close", function () {
                if (nodeGte8) {
                  child.send("exit");
                } else {
                  child.kill("SIGKILL");
                }
              });
              captureOutput(executor);
            } else {
              captureOutput(child);
            }
          } catch (e) {
            deleteDir(tmpLoc);
            throw e;
          }
        }
      };
      tests.push(test);
    });
  });
  tests.sort(function (testA, testB) {
    const nameA = testA.suiteName + "/" + testA.testName;
    const nameB = testB.suiteName + "/" + testB.testName;
    return nameA.localeCompare(nameB);
  });
  return tests;
}

//# sourceMappingURL=index.js.map
