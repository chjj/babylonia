"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateMissingPluginMessage;
const pluginNameMap = {
  classProperties: {
    syntax: {
      name: "babylonia/plugin-syntax-class-properties",
      url: "https://git.io/vb4yQ"
    },
    transform: {
      name: "babylonia/plugin-proposal-class-properties",
      url: "https://git.io/vb4SL"
    }
  },
  decorators: {
    syntax: {
      name: "babylonia/plugin-syntax-decorators",
      url: "https://git.io/vb4y9"
    },
    transform: {
      name: "babylonia/plugin-proposal-decorators",
      url: "https://git.io/vb4ST"
    }
  },
  doExpressions: {
    syntax: {
      name: "babylonia/plugin-syntax-do-expressions",
      url: "https://git.io/vb4yh"
    },
    transform: {
      name: "babylonia/plugin-proposal-do-expressions",
      url: "https://git.io/vb4S3"
    }
  },
  dynamicImport: {
    syntax: {
      name: "babylonia/plugin-syntax-dynamic-import",
      url: "https://git.io/vb4Sv"
    }
  },
  exportDefaultFrom: {
    syntax: {
      name: "babylonia/plugin-syntax-export-default-from",
      url: "https://git.io/vb4SO"
    },
    transform: {
      name: "babylonia/plugin-proposal-export-default-from",
      url: "https://git.io/vb4yH"
    }
  },
  exportNamespaceFrom: {
    syntax: {
      name: "babylonia/plugin-syntax-export-namespace-from",
      url: "https://git.io/vb4Sf"
    },
    transform: {
      name: "babylonia/plugin-proposal-export-namespace-from",
      url: "https://git.io/vb4SG"
    }
  },
  flow: {
    syntax: {
      name: "babylonia/plugin-syntax-flow",
      url: "https://git.io/vb4yb"
    },
    transform: {
      name: "babylonia/plugin-transform-flow-strip-types",
      url: "https://git.io/vb49g"
    }
  },
  functionBind: {
    syntax: {
      name: "babylonia/plugin-syntax-function-bind",
      url: "https://git.io/vb4y7"
    },
    transform: {
      name: "babylonia/plugin-proposal-function-bind",
      url: "https://git.io/vb4St"
    }
  },
  functionSent: {
    syntax: {
      name: "babylonia/plugin-syntax-function-sent",
      url: "https://git.io/vb4yN"
    },
    transform: {
      name: "babylonia/plugin-proposal-function-sent",
      url: "https://git.io/vb4SZ"
    }
  },
  importMeta: {
    syntax: {
      name: "babylonia/plugin-syntax-import-meta",
      url: "https://git.io/vbKK6"
    }
  },
  jsx: {
    syntax: {
      name: "babylonia/plugin-syntax-jsx",
      url: "https://git.io/vb4yA"
    },
    transform: {
      name: "babylonia/plugin-transform-react-jsx",
      url: "https://git.io/vb4yd"
    }
  },
  logicalAssignment: {
    syntax: {
      name: "babylonia/plugin-syntax-logical-assignment-operators",
      url: "https://git.io/vAlBp"
    },
    transform: {
      name: "babylonia/plugin-proposal-logical-assignment-operators",
      url: "https://git.io/vAlRe"
    }
  },
  nullishCoalescingOperator: {
    syntax: {
      name: "babylonia/plugin-syntax-nullish-coalescing-operator",
      url: "https://git.io/vb4yx"
    },
    transform: {
      name: "babylonia/plugin-proposal-nullish-coalescing-operator",
      url: "https://git.io/vb4Se"
    }
  },
  numericSeparator: {
    syntax: {
      name: "babylonia/plugin-syntax-numeric-separator",
      url: "https://git.io/vb4Sq"
    },
    transform: {
      name: "babylonia/plugin-proposal-numeric-separator",
      url: "https://git.io/vb4yS"
    }
  },
  optionalChaining: {
    syntax: {
      name: "babylonia/plugin-syntax-optional-chaining",
      url: "https://git.io/vb4Sc"
    },
    transform: {
      name: "babylonia/plugin-proposal-optional-chaining",
      url: "https://git.io/vb4Sk"
    }
  },
  pipelineOperator: {
    syntax: {
      name: "babylonia/plugin-syntax-pipeline-operator",
      url: "https://git.io/vb4yj"
    },
    transform: {
      name: "babylonia/plugin-proposal-pipeline-operator",
      url: "https://git.io/vb4SU"
    }
  },
  throwExpressions: {
    syntax: {
      name: "babylonia/plugin-syntax-throw-expressions",
      url: "https://git.io/vb4SJ"
    },
    transform: {
      name: "babylonia/plugin-proposal-throw-expressions",
      url: "https://git.io/vb4yF"
    }
  },
  typescript: {
    syntax: {
      name: "babylonia/plugin-syntax-typescript",
      url: "https://git.io/vb4SC"
    },
    transform: {
      name: "babylonia/plugin-transform-typescript",
      url: "https://git.io/vb4Sm"
    }
  },
  asyncGenerators: {
    syntax: {
      name: "babylonia/plugin-syntax-async-generators",
      url: "https://git.io/vb4SY"
    },
    transform: {
      name: "babylonia/plugin-proposal-async-generator-functions",
      url: "https://git.io/vb4yp"
    }
  },
  objectRestSpread: {
    syntax: {
      name: "babylonia/plugin-syntax-object-rest-spread",
      url: "https://git.io/vb4y5"
    },
    transform: {
      name: "babylonia/plugin-proposal-object-rest-spread",
      url: "https://git.io/vb4Ss"
    }
  },
  optionalCatchBinding: {
    syntax: {
      name: "babylonia/plugin-syntax-optional-catch-binding",
      url: "https://git.io/vb4Sn"
    },
    transform: {
      name: "babylonia/plugin-proposal-optional-catch-binding",
      url: "https://git.io/vb4SI"
    }
  }
};

const getNameURLCombination = ({
  name,
  url
}) => `${name} (${url})`;

function generateMissingPluginMessage(missingPluginName, loc, codeFrame) {
  let helpMessage = `Support for the experimental syntax '${missingPluginName}' isn't currently enabled ` + `(${loc.line}:${loc.column + 1}):\n\n` + codeFrame;
  const pluginInfo = pluginNameMap[missingPluginName];

  if (pluginInfo) {
    const {
      syntax: syntaxPlugin,
      transform: transformPlugin
    } = pluginInfo;

    if (syntaxPlugin) {
      if (transformPlugin) {
        const transformPluginInfo = getNameURLCombination(transformPlugin);
        helpMessage += `\n\nAdd ${transformPluginInfo} to the 'plugins' section of your Babel config ` + `to enable transformation.`;
      } else {
        const syntaxPluginInfo = getNameURLCombination(syntaxPlugin);
        helpMessage += `\n\nAdd ${syntaxPluginInfo} to the 'plugins' section of your Babel config ` + `to enable parsing.`;
      }
    }
  }

  return helpMessage;
}