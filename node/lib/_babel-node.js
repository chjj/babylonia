"use strict";

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _module() {
  const data = _interopRequireDefault(require("module"));

  _module = function () {
    return data;
  };

  return data;
}

function _util() {
  const data = require("util");

  _util = function () {
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

function _repl() {
  const data = _interopRequireDefault(require("repl"));

  _repl = function () {
    return data;
  };

  return data;
}

function babel() {
  const data = _interopRequireWildcard(require("babylonia/core"));

  babel = function () {
    return data;
  };

  return data;
}

function _vm() {
  const data = _interopRequireDefault(require("vm"));

  _vm = function () {
    return data;
  };

  return data;
}

require("babylonia/polyfill");

function _register() {
  const data = _interopRequireDefault(require("babylonia/register"));

  _register = function () {
    return data;
  };

  return data;
}

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new (_commander().default.Command)("babel-node");

function collect(value, previousValue) {
  if (typeof value !== "string") return previousValue;
  const values = value.split(",");
  return previousValue ? previousValue.concat(values) : values;
}

program.option("-e, --eval [script]", "Evaluate script");
program.option("--no-babelrc", "Specify whether or not to use .babelrc and .babelignore files");
program.option("-r, --require [module]", "Require module");
program.option("-p, --print [code]", "Evaluate script and print result");
program.option("-o, --only [globs]", "A comma-separated list of glob patterns to compile", collect);
program.option("-i, --ignore [globs]", "A comma-separated list of glob patterns to skip compiling", collect);
program.option("-x, --extensions [extensions]", "List of extensions to hook into [.es6,.js,.es,.jsx,.mjs]", collect);
program.option("--config-file [path]", "Path to the babel config file to use. Defaults to working directory babel.config.js");
program.option("--env-name [name]", "The name of the 'env' to use when loading configs and plugins. " + "Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 'development'.");
program.option("--root-mode [mode]", "The project-root resolution mode. " + "One of 'root' (the default), 'upward', or 'upward-optional'.");
program.option("-w, --plugins [string]", "", collect);
program.option("-b, --presets [string]", "", collect);
program.version(_package.default.version);
program.usage("[options] [ -e script | script.js ] [arguments]");
program.parse(process.argv);
const babelOptions = {
  caller: {
    name: "babylonia/node"
  },
  extensions: program.extensions,
  ignore: program.ignore,
  only: program.only,
  plugins: program.plugins,
  presets: program.presets,
  configFile: program.configFile,
  envName: program.envName,
  rootMode: program.rootMode,
  babelrc: program.babelrc === true ? undefined : program.babelrc
};

for (const key of Object.keys(babelOptions)) {
  if (babelOptions[key] === undefined) {
    delete babelOptions[key];
  }
}

(0, _register().default)(babelOptions);

const replPlugin = ({
  types: t
}) => ({
  visitor: {
    ModuleDeclaration(path) {
      throw path.buildCodeFrameError("Modules aren't supported in the REPL");
    },

    VariableDeclaration(path) {
      if (path.node.kind !== "var") {
        throw path.buildCodeFrameError("Only `var` variables are supported in the REPL");
      }
    },

    Program(path) {
      if (path.get("body").some(child => child.isExpressionStatement())) return;
      path.pushContainer("body", t.expressionStatement(t.identifier("undefined")));
    }

  }
});

const _eval = function (code, filename) {
  code = code.trim();
  if (!code) return undefined;
  code = babel().transform(code, {
    filename: filename,
    presets: program.presets,
    plugins: (program.plugins || []).concat([replPlugin])
  }).code;
  return _vm().default.runInThisContext(code, {
    filename: filename
  });
};

if (program.eval || program.print) {
  let code = program.eval;
  if (!code || code === true) code = program.print;
  global.__filename = "[eval]";
  global.__dirname = process.cwd();
  const module = new (_module().default)(global.__filename);
  module.filename = global.__filename;
  module.paths = _module().default._nodeModulePaths(global.__dirname);
  global.exports = module.exports;
  global.module = module;
  global.require = module.require.bind(module);

  const result = _eval(code, global.__filename);

  if (program.print) {
    const output = typeof result === "string" ? result : (0, _util().inspect)(result);
    process.stdout.write(output + "\n");
  }
} else {
  if (program.args.length) {
    let args = process.argv.slice(2);
    let i = 0;
    let ignoreNext = false;
    args.some(function (arg, i2) {
      if (ignoreNext) {
        ignoreNext = false;
        return;
      }

      if (arg[0] === "-") {
        const camelArg = arg.slice(2).replace(/-(\w)/, (s, c) => c.toUpperCase());
        const parsedArg = program[camelArg];

        if (arg === "-r" || arg === "--require" || parsedArg && parsedArg !== true) {
          ignoreNext = true;
        }
      } else {
        i = i2;
        return true;
      }
    });
    args = args.slice(i);

    if (program.require) {
      let requireFileName = program.require;

      if (!_path().default.isAbsolute(requireFileName)) {
        requireFileName = _path().default.join(process.cwd(), requireFileName);
      }

      require(requireFileName);
    }

    const filename = args[0];

    if (!_path().default.isAbsolute(filename)) {
      args[0] = _path().default.join(process.cwd(), filename);
    }

    process.argv = ["node"].concat(args);
    process.execArgv.unshift(__filename);

    _module().default.runMain();
  } else {
    replStart();
  }
}

function replStart() {
  _repl().default.start({
    prompt: "> ",
    input: process.stdin,
    output: process.stdout,
    eval: replEval,
    useGlobal: true
  });
}

function replEval(code, context, filename, callback) {
  let err;
  let result;

  try {
    if (code[0] === "(" && code[code.length - 1] === ")") {
      code = code.slice(1, -1);
    }

    result = _eval(code, filename);
  } catch (e) {
    err = e;
  }

  callback(err, result);
}