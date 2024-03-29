"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = get;
exports.multiple = multiple;
exports.readFile = readFile;
exports.resolveOptionPluginOrPreset = resolveOptionPluginOrPreset;
var _semver = require("semver");
var _path = require("path");
var _fs = require("fs");
var _url = require("url");
var _module = require("module");
const nodeVersion = _semver.clean(process.version.slice(1));
function humanize(val, noext) {
  if (noext) val = _path.basename(val, _path.extname(val));
  return val.replace(/-/g, " ");
}
function tryResolve(module) {
  try {
    return require.resolve(module);
  } catch (e) {
    return null;
  }
}
function assertDirectory(loc) {
  if (!_fs.statSync(loc).isDirectory()) {
    throw new Error(`Expected ${loc} to be a directory.`);
  }
}
function shouldIgnore(name, ignore) {
  if (ignore && ignore.indexOf(name) >= 0) {
    return true;
  }
  const ext = _path.extname(name);
  const base = _path.basename(name, ext);
  return name[0] === "." || ext === ".md" || base === "LICENSE" || base === "options" || name === "package.json";
}
const EXTENSIONS = [".js", ".mjs", ".ts", ".tsx", ".cts", ".mts", ".vue"];
const JSON_AND_EXTENSIONS = [".json", ...EXTENSIONS];
function checkFile(loc, allowJSON, matchedLoc) {
  const ext = _path.extname(loc);
  const extensions = allowJSON ? JSON_AND_EXTENSIONS : EXTENSIONS;
  if (!extensions.includes(ext)) {
    throw new Error(`Unsupported input extension: ${loc}`);
  }
  if (!matchedLoc) {
    return loc;
  } else {
    throw new Error(`Found conflicting file matches: ${matchedLoc},${loc}`);
  }
}
function pushTask(taskName, taskDir, suite, suiteName) {
  var _taskOpts$externalHel;
  const taskDirStats = _fs.statSync(taskDir);
  let actualLoc, expectLoc, execLoc, execLocAlias, taskOptsLoc, stdoutLoc, stderrLoc, sourceMapLoc, sourceMapVisualLoc, inputSourceMap;
  const taskOpts = JSON.parse(JSON.stringify(suite.options));
  if (taskDirStats.isDirectory()) {
    var _actualLoc, _execLoc, _expectLoc;
    const files = _fs.readdirSync(taskDir);
    for (const file of files) {
      const loc = _path.join(taskDir, file);
      const name = _path.basename(file, _path.extname(file));
      switch (name) {
        case "input":
          actualLoc = checkFile(loc, false, actualLoc);
          break;
        case "exec":
          execLoc = checkFile(loc, false, execLoc);
          break;
        case "output":
          expectLoc = checkFile(loc, true, expectLoc);
          break;
        case "output.extended":
          expectLoc = checkFile(loc, true, expectLoc);
          break;
        case "options":
          taskOptsLoc = loc;
          Object.assign(taskOpts, require(taskOptsLoc));
          break;
        case "source-map":
          sourceMapLoc = loc;
          break;
        case "source-map-visual":
          sourceMapVisualLoc = loc;
          break;
        case "input-source-map":
          inputSourceMap = JSON.parse(readFile(loc));
          break;
      }
    }
    if (files.length > 0 && !actualLoc && !execLoc) {
      console.warn(`Skipped test folder with invalid layout: ${taskDir}`);
      return;
    }
    (_actualLoc = actualLoc) != null ? _actualLoc : actualLoc = taskDir + "/input.js";
    (_execLoc = execLoc) != null ? _execLoc : execLoc = taskDir + "/exec.js";
    (_expectLoc = expectLoc) != null ? _expectLoc : expectLoc = taskDir + "/output.js";
    stdoutLoc = taskDir + "/stdout.txt";
    stderrLoc = taskDir + "/stderr.txt";
  } else if (taskDirStats.isFile()) {
    const ext = _path.extname(taskDir);
    if (EXTENSIONS.indexOf(ext) === -1) return;
    execLoc = taskDir;
    execLocAlias = suiteName + "/" + taskName;
  } else {
    console.warn(`Skipped test folder with invalid layout: ${taskDir}`);
    return;
  }
  const shouldIgnore = taskOpts.BABEL_8_BREAKING === true;
  if (shouldIgnore) return;
  function buildTestFile(loc, fileName) {
    return {
      loc,
      code: readFile(loc),
      filename: !loc ? undefined : fileName === true ? suiteName + "/" + taskName + "/" + _path.basename(loc) : fileName || undefined
    };
  }
  const sourceMapFile = buildTestFile(sourceMapLoc, true);
  sourceMapFile.code && (sourceMapFile.code = JSON.parse(sourceMapFile.code));
  const test = {
    taskDir,
    optionsDir: taskOptsLoc ? _path.dirname(taskOptsLoc) : null,
    title: humanize(taskName, true),
    disabled: taskName[0] === ".",
    options: taskOpts,
    doNotSetSourceType: taskOpts.DO_NOT_SET_SOURCE_TYPE,
    externalHelpers: (_taskOpts$externalHel = taskOpts.externalHelpers) != null ? _taskOpts$externalHel : !!tryResolve("babylonia/plugin-external-helpers"),
    validateLogs: taskOpts.validateLogs,
    ignoreOutput: taskOpts.ignoreOutput,
    stdout: buildTestFile(stdoutLoc),
    stderr: buildTestFile(stderrLoc),
    exec: buildTestFile(execLoc, execLocAlias),
    actual: buildTestFile(actualLoc, true),
    expect: buildTestFile(expectLoc, true),
    sourceMap: sourceMapFile.code,
    sourceMapFile,
    sourceMapVisual: buildTestFile(sourceMapVisualLoc),
    validateSourceMapVisual: taskOpts.sourceMaps === true || taskOpts.sourceMaps === "both",
    inputSourceMap
  };
  if (test.exec.code && test.actual.code && _path.extname(execLoc) !== _path.extname(actualLoc)) {
    throw new Error(`Input file extension should match exec file extension: ${execLoc}, ${actualLoc}`);
  }
  delete taskOpts.BABEL_8_BREAKING;
  delete taskOpts.DO_NOT_SET_SOURCE_TYPE;
  if (taskOpts.minNodeVersion) {
    const minimumVersion = _semver.clean(taskOpts.minNodeVersion);
    if (minimumVersion == null) {
      throw new Error(`'minNodeVersion' has invalid semver format: ${taskOpts.minNodeVersion}`);
    }
    if (_semver.lt(nodeVersion, minimumVersion)) {
      return;
    }
    delete taskOpts.minNodeVersion;
  }
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
  suite.tests.push(test);
  if (taskOpts.throws) {
    if (test.expect.code) {
      throw new Error("Test cannot throw and also return output code: " + expectLoc);
    }
    if (test.sourceMap) {
      throw new Error("Test cannot throw and also return sourcemaps: " + sourceMapLoc);
    }
  }
  if (!test.validateLogs && (test.stdout.code || test.stderr.code)) {
    throw new Error("stdout.txt and stderr.txt are only allowed when the 'validateLogs' option is enabled: " + (test.stdout.code ? stdoutLoc : stderrLoc));
  }
  if (test.ignoreOutput) {
    if (test.expect.code) {
      throw new Error("Test cannot ignore its output and also validate it: " + expectLoc);
    }
    if (!test.validateLogs) {
      throw new Error("ignoreOutput can only be used when validateLogs is true: " + taskOptsLoc);
    }
  }
  delete test.options.validateLogs;
  delete test.options.ignoreOutput;
  delete test.options.externalHelpers;
}
function wrapPackagesArray(type, names, optionsDir) {
  return names.map(function (val) {
    if (typeof val === "string") val = [val];
    if (val[0][0] === ".") {
      if (!optionsDir) {
        throw new Error("Please provide an options.json in test dir when using a " + "relative plugin path.");
      }
      val[0] = _path.resolve(optionsDir, val[0]);
    } else {
      let name = val[0];
      const match = name.match(/^(babylonia\/(?:plugin-|preset-)?)(.*)$/);
      if (match) {
        name = match[2];
      }
      const monorepoPath = _path.join(_path.dirname(__filename), "../../..", name.startsWith("codemod") ? "codemods" : "packages", `babel-${type}-${name}/lib/index.js`);
      if (_fs.existsSync(monorepoPath)) {
        if (match) {
          throw new Error(`Remove the "${match[1]}" prefix from "${val[0]}", to load it from the monorepo`);
        }
        val[0] = monorepoPath;
      }
    }
    return val;
  });
}
function resolveOptionPluginOrPreset(options, optionsDir) {
  if (options.overrides) {
    for (const subOption of options.overrides) {
      resolveOptionPluginOrPreset(subOption, optionsDir);
    }
  }
  if (options.env) {
    for (const envName in options.env) {
      if (!{}.hasOwnProperty.call(options.env, envName)) continue;
      resolveOptionPluginOrPreset(options.env[envName], optionsDir);
    }
  }
  if (options.plugins) {
    options.plugins = wrapPackagesArray("plugin", options.plugins, optionsDir);
  }
  if (options.presets) {
    options.presets = wrapPackagesArray("preset", options.presets, optionsDir).map(function (val) {
      if (val.length > 3) {
        throw new Error("Unexpected extra options " + JSON.stringify(val.slice(3)) + " passed to preset.");
      }
      return val;
    });
  }
  return options;
}
function get(entryLoc) {
  const suites = [];
  let rootOpts = {};
  const rootOptsLoc = tryResolve(entryLoc + "/options");
  if (rootOptsLoc) rootOpts = require(rootOptsLoc);
  for (const suiteName of _fs.readdirSync(entryLoc)) {
    if (shouldIgnore(suiteName)) continue;
    const suite = {
      options: Object.assign({}, rootOpts),
      tests: [],
      title: humanize(suiteName),
      filename: entryLoc + "/" + suiteName
    };
    assertDirectory(suite.filename);
    suites.push(suite);
    const suiteOptsLoc = tryResolve(suite.filename + "/options");
    if (suiteOptsLoc) {
      suite.options = resolveOptionPluginOrPreset(require(suiteOptsLoc), suite.filename);
    }
    for (const taskName of _fs.readdirSync(suite.filename)) {
      pushTask(taskName, suite.filename + "/" + taskName, suite, suiteName);
    }
  }
  return suites;
}
function multiple(entryLoc, ignore) {
  const categories = {};
  for (const name of _fs.readdirSync(entryLoc)) {
    if (shouldIgnore(name, ignore)) continue;
    const loc = _path.join(entryLoc, name);
    assertDirectory(loc);
    categories[name] = get(loc);
  }
  return categories;
}
function readFile(filename) {
  try {
    if (filename === undefined) {
      return "";
    }
    return _fs.readFileSync(filename, "utf8").trimRight();
  } catch (e) {
    if (e.code === "ENOENT") {
      return "";
    }
    throw e;
  }
}

//# sourceMappingURL=index.js.map
